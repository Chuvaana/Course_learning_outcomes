import { Injectable } from '@angular/core';
import { forkJoin, from, of } from 'rxjs';
import { CurriculumService } from '../../../../services/curriculum.service';
import { SharedService } from '../../../../services/sharedService';
import { TeacherService } from '../../../../services/teacherService';
import { catchError, concatMap, map, switchMap, toArray } from 'rxjs/operators';
import { MaterialService } from '../../../../services/materialService';
import { OtherService } from '../../../../services/other.service';
import { CLOService } from '../../../../services/cloService';

interface Info {
  lessonName: string;
  lessonCode: string;
  lessonCredit: number;
  school: string;
  department: string;
  prerequisite: string;
  schoolYear: string;
  assistantTeacherName: string;
  assistantTeacherRoom: string;
  assistantTeacherEmail: string;
  assistantTeacherPhone: number;
  teacherName: string;
  teacherRoom: string;
  teacherEmail: string;
  teacherPhone: number;
  lessonLevel: string;
  lessonType: string;
  recommendedSemester: string;
  weeklyLecture: number;
  weeklySeminar: number;
  weeklyLab: number;
  weeklyAssignment: number;
  weeklyPractice: number;
  totalLecture: number;
  totalSeminar: number;
  totalLab: number;
  totalAssignment: number;
  totalPractice: number;
  selfStudyLecture: number;
  selfStudySeminar: number;
  selfStudyLab: number;
  selfStudyAssignment: number;
  selfStudyPractice: number;
  createdTeacherBy: string;
  createdTeacherDatetime: string;
  checkManagerBy: string;
  checkManagerDatetime: string;
}

@Injectable({
  providedIn: 'root',
})
export class LessonCopyService {
  constructor(
    private service: CurriculumService,
    private teacherService: TeacherService,
    private sharedService: SharedService,
    private matService: MaterialService,
    private otherService: OtherService,
    private cloService: CLOService
  ) {}

  copyLessonMainInfo(id: string, teacherId: string, schoolYear: string) {
    return (
      this.service.getMainInfo(id).subscribe((mainInfo: any) => {
        const info: Info = {
          lessonName: `${mainInfo.lessonName} copy`,
          lessonCode: mainInfo.lessonCode,
          lessonCredit: mainInfo.lessonCredit,
          school: mainInfo.school,
          department: mainInfo.department,
          prerequisite: mainInfo.prerequisite,
          schoolYear: schoolYear,
          assistantTeacherName: mainInfo.assistantTeacher?.name || '',
          assistantTeacherEmail: mainInfo.assistantTeacher?.email || '',
          assistantTeacherPhone: mainInfo.assistantTeacher?.phone || 0,
          assistantTeacherRoom: mainInfo.assistantTeacher?.room || '',
          teacherName: mainInfo.teacher?.name || '',
          teacherEmail: mainInfo.teacher?.email || '',
          teacherPhone: mainInfo.teacher?.phone || 0,
          teacherRoom: mainInfo.teacher?.room || '',
          lessonLevel: mainInfo.lessonLevel,
          lessonType: mainInfo.lessonType,
          recommendedSemester: mainInfo.recommendedSemester,
          weeklyLecture: mainInfo.weeklyHours?.lecture || 0,
          weeklySeminar: mainInfo.weeklyHours?.seminar || 0,
          weeklyLab: mainInfo.weeklyHours?.lab || 0,
          weeklyAssignment: mainInfo.weeklyHours?.assignment || 0,
          weeklyPractice: mainInfo.weeklyHours?.practice || 0,
          totalLecture: mainInfo.totalHours?.lecture || 0,
          totalSeminar: mainInfo.totalHours?.seminar || 0,
          totalLab: mainInfo.totalHours?.lab || 0,
          totalAssignment: mainInfo.totalHours?.assignment || 0,
          totalPractice: mainInfo.totalHours?.practice || 0,
          selfStudyLecture: mainInfo.selfStudyHours?.lecture || 0,
          selfStudySeminar: mainInfo.selfStudyHours?.seminar || 0,
          selfStudyLab: mainInfo.selfStudyHours?.lab || 0,
          selfStudyAssignment: mainInfo.selfStudyHours?.assignment || 0,
          selfStudyPractice: mainInfo.selfStudyHours?.practice || 0,
          createdTeacherBy: '',
          createdTeacherDatetime: '',
          checkManagerBy: '',
          checkManagerDatetime: '',
        };

        // Save lesson and chain further logic
        return this.service.saveLesson(info);
      }),
      switchMap((response: any) => {
        const data = {
          lessonId: response.lesson.id,
          teacherId: teacherId,
        };

        // Proceed with copying materials, CLOs, etc.
        return forkJoin({
          saveLessonTeacher: this.service.addLessonToTeacher(teacherId, data),
          materials: this.matService.getMaterials(id).pipe(
            switchMap((materialsResponse: any) => {
              materialsResponse.forEach((material: any) => {
                delete material._id;
                delete material.createdAt;
                delete material.updatedAt;
                delete material.__v;
                material.lessonId = response.lesson.id;
              });
              return this.matService.addMaterials(materialsResponse);
            }),
            catchError(() => of(false))
          ),
          defi: this.otherService.getDefinition(id).pipe(
            switchMap((defResponse: any) => {
              defResponse.forEach((def: any) => {
                delete def._id;
                delete def.__v;
                def.lessonId = response.lesson.id;
              });
              return this.otherService.addDefinition(defResponse);
            }),
            catchError(() => of(false))
          ),
          clo: this.cloService.getCloList(id).pipe(
            switchMap((cloResponse: any[]) => {
              const oldNewCloMap = new Map<string, string>();
              return from(cloResponse).pipe(
                concatMap((clo: any) => {
                  const oldId = clo.id;
                  delete clo.id;
                  delete clo.createdAt;
                  delete clo.updatedAt;
                  clo.lessonId = response.lesson.id;

                  return this.cloService.registerClo(clo).pipe(
                    map((registeredClo: any) => {
                      oldNewCloMap.set(oldId, registeredClo.id);
                      return registeredClo;
                    })
                  );
                }),
                toArray(),
                map(() => oldNewCloMap)
              );
            }),
            catchError(() => of(false))
          ),
        });
      }),
      catchError(() => of(false))
    );
  }
}
