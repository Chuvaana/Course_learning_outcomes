import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { Image } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import {
  concatMap,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import { AdditionalService } from '../../../../services/additionalService';
import { CLOService } from '../../../../services/cloService';
import { CurriculumService } from '../../../../services/curriculum.service';
import { MaterialService } from '../../../../services/materialService';
import { MethodService } from '../../../../services/methodService';
import { OtherService } from '../../../../services/other.service';
import { ScheduleService } from '../../../../services/schedule.service';
import { TeacherService } from '../../../../services/teacherService';
import { ToastModule } from 'primeng/toast';
import { AssessmentService } from '../../../../services/assessmentService';
import { CloPointPlanService } from '../../../../services/cloPointPlanService';

interface Lesson {
  id: string;
  title: string;
  code: string;
  department: string;
}

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

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [
    Image,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    RippleModule,
    DropdownModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.scss'],
})
export class LessonListComponent implements OnInit {
  @Input() create = true;
  isFormVisible = false;
  lessons: Lesson[] = [];
  courses: any[] = [];
  course = '';
  branches: any[] = [];
  departments: any[] = [];

  cities: any;

  selectedCity: any;
  selectedYear: any;
  selectedSeason: any;

  recommendedSemester = [
    { label: 'Намар', value: 'autumn' },
    { label: 'Хавар', value: 'spring' },
    { label: 'Дурын', value: 'any' },
    { label: 'Өвлийн улирал', value: 'winter' },
    { label: 'Зуны улирал', value: 'summer' },
  ];

  yearIntervals: string[] = [];
  selectedInterval: string = '';
  season!: string;
  teacherId!: string;

  constructor(
    private service: TeacherService,
    private router: Router,
    private cirService: CurriculumService,
    private matService: MaterialService,
    private otherService: OtherService,
    private cloService: CLOService,
    private addService: AdditionalService,
    private methodService: MethodService,
    private scheService: ScheduleService,
    private msgService: MessageService,
    private assessService: AssessmentService,
    private cloPointPlanService: CloPointPlanService
  ) {}

  ngOnInit(): void {
    this.teacherId = localStorage.getItem('teacherId') || '';
    forkJoin({
      schoolYear: this.service.getConfig('School_year'),
      season: this.service.getConfig('season'),
    }).subscribe(({ schoolYear, season }) => {
      if (schoolYear) {
        this.selectedInterval = schoolYear.itemValue;
      }
      if (season) {
        this.selectedSeason = season.itemValue;
        console.log(this.selectedSeason);
      }

      this.readData(this.teacherId, this.selectedInterval, this.selectedSeason);
    });

    this.generateYearIntervals(
      new Date().getFullYear() - 5,
      new Date().getFullYear()
    );
  }

  readData(teacherId: string, year: string, season: string) {
    this.service
      .getTeacherLessons(teacherId, year, season)
      .subscribe((data) => {
        if (data) {
          const courseObservables: Observable<any>[] = data.lessons.map(
            (item: any) => {
              if (item.department) {
                return this.service.getDepartments(item.school).pipe(
                  map((departments: any[]) => {
                    const selectedDept = departments.find(
                      (dept) => dept.id === item.department
                    );
                    return {
                      ...item,
                      department: selectedDept
                        ? selectedDept.name
                        : item.department,
                    };
                  })
                );
              } else {
                return new Observable((observer) => {
                  observer.next(item);
                  observer.complete();
                });
              }
            }
          );

          forkJoin(courseObservables).subscribe((updatedCourses: any[]) => {
            this.courses = updatedCourses;
          });
        }
      });
  }

  generateYearIntervals(startYear: number, endYear: number) {
    for (let year = startYear; year < endYear; year++) {
      this.yearIntervals.push(`${year}-${year + 1}`);
    }
    this.selectedInterval = this.yearIntervals[0]; // Default selection
  }

  addLesson() {
    this.router.navigate(['/main/teacher/curriculum']);
  }

  onCourseChange(courseId: string) {
    this.course = courseId;
  }
  onYearChange(event: any) {
    this.courses = [];
    this.readData(this.teacherId, event, this.selectedSeason);
  }
  onSeasonChange(event: any) {
    this.courses = [];
    this.readData(this.teacherId, this.selectedInterval, event);
  }

  copyLessonToClipboard(lesson: any) {
    this.cirService.getMainInfo(lesson.id).subscribe((mainInfo: any) => {
      const info: Info = {
        lessonName: `${mainInfo.lessonName} copy`,
        lessonCode: mainInfo.lessonCode,
        lessonCredit: mainInfo.lessonCredit,
        school: mainInfo.school,
        department: mainInfo.department,
        prerequisite: mainInfo.prerequisite,
        schoolYear: this.selectedInterval,
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
      this.cirService.saveLesson(info).subscribe((response: any) => {
        const newLessonId = response.lesson.id;
        const data = {
          lessonId: response.lesson.id,
          teacherId: this.teacherId,
        };

        this.cirService
          .addLessonToTeacher(this.teacherId, data)
          .subscribe((res) => {
            console.log(res);
          });

        this.matService
          .getMaterials(lesson.id)
          .subscribe((materialsResponse: any) => {
            delete materialsResponse._id;
            delete materialsResponse.createdAt;
            delete materialsResponse.updatedAt;
            delete materialsResponse.__v;
            materialsResponse.lessonId = newLessonId;

            this.matService.addMaterials(materialsResponse).subscribe((res) => {
              console.log(res);
            });
          });

        this.otherService
          .getDefinition(lesson.id)
          .subscribe((defResponse: any) => {
            defResponse.forEach((def: any) => {
              delete def._id;
              delete def.__v;
              def.lessonId = newLessonId;
            });
            this.otherService.addDefinition(defResponse[0]).subscribe((res) => {
              console.log(res);
            });
          });

        this.addService
          .getAdditional(lesson.id)
          .subscribe((addResponse: any) => {
            delete addResponse._id;
            delete addResponse.__v;
            addResponse.lessonId = newLessonId;

            this.addService.addAdditional(addResponse).subscribe((res) => {
              console.log(res);
            });
          });

        const oldNewCloMap = new Map<string, string>();

        this.cloService
          .getCloList(lesson.id)
          .pipe(
            switchMap((cloList: any[]) => {
              return from(cloList).pipe(
                concatMap((item: any) => {
                  const oldId = item.id;
                  delete item.id;
                  delete item.createdAt;
                  delete item.updatedAt;
                  item.lessonId = newLessonId;

                  return this.cloService.registerClo(item).pipe(
                    tap((registeredClo: any) => {
                      oldNewCloMap.set(oldId, registeredClo.id);
                    })
                  );
                }),
                toArray()
              );
            }),

            switchMap(() => {
              return forkJoin({
                lec: this.scheService.getSchedules(lesson.id),
                sem: this.scheService.getScheduleSems(lesson.id),
                lab: this.scheService.getScheduleLabs(lesson.id),
                bd: this.scheService.getScheduleBds(lesson.id),
              }).pipe(
                switchMap(({ lec, sem, lab, bd }) => {
                  // Function to transform the arrays and check if they are non-empty
                  const transform = (arr: any[]) =>
                    arr
                      .filter((item) => item && Object.keys(item).length > 0) // Filter out empty items or empty arrays
                      .map((item: any) => {
                        delete item._id;
                        delete item.__v;
                        item.lessonId = newLessonId;
                        if (item.cloRelevance?.id) {
                          item.cloRelevance = oldNewCloMap.get(
                            item.cloRelevance.id
                          );
                        }
                        return item;
                      });

                  // Check if the arrays have items, only make requests for non-empty arrays
                  const requests = [];
                  if (lec.length > 0)
                    requests.push(
                      this.scheService.addSchedulesArray(transform(lec))
                    );
                  if (sem.length > 0)
                    requests.push(
                      this.scheService.addScheduleSemsArray(transform(sem))
                    );
                  if (lab.length > 0)
                    requests.push(
                      this.scheService.addScheduleLabsArray(transform(lab))
                    );
                  if (bd.length > 0)
                    requests.push(
                      this.scheService.addScheduleBdsArray(transform(bd))
                    );

                  // Only proceed if we have valid requests to send
                  return requests.length > 0 ? forkJoin(requests) : of([]); // If no requests, return an empty observable
                })
              );
            }),
            switchMap(() => this.methodService.getMethod(lesson.id)),
            switchMap((methodResponse: any[]) => {
              const updatedMethods = methodResponse.map((item: any) => {
                delete item._id;
                delete item.createdAt;
                delete item.updatedAt;
                delete item.__v;
                item.lessonId = newLessonId;

                item.cloRelevance = item.cloRelevance.map((clo: any) => {
                  return oldNewCloMap.get(clo.id) || clo.id;
                });
                return item;
              });

              return this.methodService.createMethods(updatedMethods);
            }),
            switchMap(() =>
              this.assessService.getAssessmentByLesson(lesson.id).pipe(
                switchMap((res: any) => {
                  const oldSubMethodIds: string[] = [];

                  const cleanedPlans = res.plans.map((plan: any) => {
                    const subMethods = plan.subMethods.map((sub: any) => {
                      oldSubMethodIds.push(sub._id);
                      return {
                        subMethod: sub.subMethod,
                        point: sub.point,
                      };
                    });

                    return {
                      methodName: plan.methodName,
                      methodType: plan.methodType,
                      secondMethodType: plan.secondMethodType,
                      frequency: plan.frequency,
                      subMethods: subMethods,
                    };
                  });

                  return this.assessService
                    .saveAssessmentMethod({
                      lessonId: newLessonId,
                      plans: cleanedPlans,
                    })
                    .pipe(
                      map((saved: any) => {
                        const newSubMethodIds: string[] = [];

                        saved.plans.forEach((plan: any) => {
                          newSubMethodIds.push(...plan.subMethods);
                        });

                        const oldNewSubMethodMap = new Map<string, string>();
                        oldSubMethodIds.forEach((oldId, index) => {
                          oldNewSubMethodMap.set(oldId, newSubMethodIds[index]);
                        });
                        console.log(oldNewSubMethodMap);

                        return oldNewSubMethodMap; // return the mapping
                      })
                    );
                })
              )
            ),
            switchMap((oldNewSubMethodMap) =>
              this.cloPointPlanService.getPointPlan(lesson.id).pipe(
                map((res: any[]) => {
                  // Assuming res is an array of objects
                  return res.map((item) => {
                    // Update lessonId and remove unnecessary fields
                    item.lessonId = newLessonId;
                    if (item._id) delete item._id;
                    if (item.__v) delete item.__v;

                    // Remap cloId
                    item.cloId = oldNewCloMap.get(item.cloId) || item.cloId;

                    // Remap subMethodIds in procPoints
                    item.procPoints = item.procPoints?.map((p: any) => ({
                      ...p,
                      subMethodId:
                        oldNewSubMethodMap.get(p.subMethodId) || p.subMethodId,
                    }));

                    // Remap subMethodIds in examPoints
                    item.examPoints = item.examPoints?.map((p: any) => ({
                      ...p,
                      subMethodId:
                        oldNewSubMethodMap.get(p.subMethodId) || p.subMethodId,
                    }));

                    return item; // Return the updated item
                  });
                }),
                switchMap((updated) =>
                  this.cloPointPlanService.saveCloPlan(updated)
                ) // Save the updated item
              )
            )
          )
          .subscribe({
            next: (result) => {
              this.readData(
                this.teacherId,
                this.selectedInterval,
                this.selectedSeason
              );
              this.msgService.add({
                severity: 'success',
                summary: 'Амжилттай',
                detail: 'Амжилттай хуулагдлаа!',
              });
            },
            error: (err) => {
              this.msgService.add({
                severity: 'error',
                summary: 'Алдаа',
                detail: 'Алдаа гарлаа: ' + err.error.message,
              });
            },
          });
      });
    });
  }
}
