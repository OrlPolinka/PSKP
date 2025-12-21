create database OPV;

create table AUDITORIUM_TYPE 
(    AUDITORIUM_TYPE  char(10) constraint AUDITORIUM_TYPE_PK  primary key,  
      AUDITORIUM_TYPENAME  varchar(30)       
 )
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,  AUDITORIUM_TYPENAME )        values ('ЛК', 'Лекционная');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,  AUDITORIUM_TYPENAME )         values ('ЛБ-К', 'Компьютерный класс');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME )         values ('ЛК-К', 'Лекционная с уст. проектором');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,  AUDITORIUM_TYPENAME )          values  ('ЛБ-X', 'Химическая лаборатория');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME )        values  ('ЛБ-СК', 'Спец. компьютерный класс');

drop table AUDITORIUM_TYPE;

create table AUDITORIUM 
(   AUDITORIUM   char(20)  constraint AUDITORIUM_PK  primary key,              
    AUDITORIUM_TYPE     char(10) constraint  AUDITORIUM_AUDITORIUM_TYPE_FK foreign key         
                      references AUDITORIUM_TYPE(AUDITORIUM_TYPE), 
   AUDITORIUM_CAPACITY  integer constraint  AUDITORIUM_CAPACITY_CHECK default 1  check (AUDITORIUM_CAPACITY between 1 and 300),  -- вместимость 
   AUDITORIUM_NAME      varchar(50)                                     
)
insert into  AUDITORIUM   (AUDITORIUM, AUDITORIUM_NAME,  
 AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)   
values  ('206-1', '206-1','ЛБ-К', 15);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, 
AUDITORIUM_TYPE, AUDITORIUM_CAPACITY) 
values  ('301-1',   '301-1', 'ЛБ-К', 15);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, 
AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )   
values  ('236-1',   '236-1', 'ЛК',   60);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, 
AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )  
values  ('313-1',   '313-1', 'ЛК-К',   60);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, 
AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )  
values  ('324-1',   '324-1', 'ЛК-К',   50);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, 
AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )   
 values  ('413-1',   '413-1', 'ЛБ-К', 15);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, 
AUDITORIUM_TYPE, AUDITORIUM_CAPACITY ) 
values  ('423-1',   '423-1', 'ЛБ-К', 90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, 
AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )     
values  ('408-2',   '408-2', 'ЛК',  90);

drop table AUDITORIUM;

  create table FACULTY
  (    FACULTY      char(10)   constraint  FACULTY_PK primary key,
       FACULTY_NAME  varchar(50) default '???'
  );
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('ХТиТ',   'Химическая технология и техника');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('ЛХФ',     'Лесохозяйственный факультет');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('ИЭФ',     'Инженерно-экономический факультет');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('ТТЛП',    'Технология и техника лесной промышленности');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('ТОВ',     'Технология органических веществ');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('ИТ',     'Факультет информационных технологий');  


create table  PULPIT 
(   PULPIT   char(20)  constraint PULPIT_PK  primary key,
    PULPIT_NAME  varchar(100), 
    FACULTY   char(10)   constraint PULPIT_FACULTY_FK foreign key 
                         references FACULTY(FACULTY) 
);  
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY )
  values  ('ИСиТ', 'Информационных систем и технологий ','ИТ'  )
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
    values  ('ЛВ', 'Лесоводства','ЛХФ')          
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
   values  ('ЛУ', 'Лесоустройства','ЛХФ')           
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
  values  ('ЛЗиДВ', 'Лесозащиты и древесиноведения','ЛХФ')                
insert into PULPIT   (PULPIT,  PULPIT_NAME, FACULTY)
   values  ('ЛКиП', 'Лесных культур и почвоведения','ЛХФ') 
insert into PULPIT   (PULPIT,  PULPIT_NAME, FACULTY)
   values  ('ТиП', 'Туризма и природопользования','ЛХФ')              
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
   values  ('ЛПиСПС','Ландшафтного проектирования и садово-паркового строи-тельства','ЛХФ')          
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
   values  ('ТЛ', 'Транспорта леса', 'ТТЛП')                          
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
   values  ('ЛМиЛЗ','Лесных машин и технологии лесозаготовок','ТТЛП')  
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
   values  ('ТДП','Технологий деревообрабатывающих производств', 'ТТЛП')   
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
values  ('ТиДИД','Технологии и дизайна изделий из древесины','ТТЛП')    
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
values  ('ОХ', 'Органической химии','ТОВ') 
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
 values  ('ХПД','Химической переработки древесины','ТОВ')             
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
 values  ('ТНВиОХТ','Технологии неорганических веществ и общей химической технологии ','ХТиТ') 
insert into PULPIT   (PULPIT, PULPIT_NAME, FACULTY)
    values  ('ПиАХП','Процессов и аппаратов химических производств','ХТиТ')                                               
insert into PULPIT   (PULPIT,    PULPIT_NAME, FACULTY)
values  ('ЭТиМ',    'Экономической теории и маркетинга','ИЭФ')   
insert into PULPIT   (PULPIT,    PULPIT_NAME, FACULTY)
  values  ('МиЭП',   'Менеджмента и экономики природопользования','ИЭФ')   
insert into PULPIT   (PULPIT,    PULPIT_NAME, FACULTY)
   values  ('СБУАиА', 'Статистики, бухгалтерского учета, анализа и аудита', 'ИЭФ')     


create table TEACHER
 (   TEACHER    char(10)  constraint TEACHER_PK  primary key,
     TEACHER_NAME  varchar(100), 
     PULPIT   char(20) constraint TEACHER_PULPIT_FK foreign key 
                         references PULPIT(PULPIT) 
 );
insert into  TEACHER    (TEACHER,   TEACHER_NAME, PULPIT )
                       values  ('СМЛВ',    'Смелов Владимир Владиславович',  'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('ДТК',     'Дятко Александр Аркадьевич', 'ИВД');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('УРБ',     'Урбанович Павел Павлович', 'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                      values  ('ГРН',     'Гурин Николай Иванович', 'ИСиТ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('ЖЛК',     'Жиляк Надежда Александровна', 'ИСиТ');                     
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('МРЗ',     'Мороз Елена Станиславовна',  'ИСиТ');                                                                                           
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
             values  ('БРТШВЧ',   'Барташевич Святослав Александрович', 'ПОиСОИ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('АРС',     'Арсентьев Виталий Арсентьевич',  'ПОиСОИ');                       
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('НВРВ',   'Неверов Александр Васильевич',  'МиЭП');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('РВКЧ',   'Ровкач Андрей Иванович', 'ЛВ');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('ДМДК', 'Демидко Марина Николаевна',  'ЛПиСПС');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('БРГ',     'Бурганская Татьяна Минаевна', 'ЛПиСПС');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('РЖК',   'Рожков Леонид Николаевич ', 'ЛВ');                      
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('ЗВГЦВ',   'Звягинцев Вячеслав Борисович',  'ЛЗиДВ'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('БЗБРДВ',   'Безбородов Владимир Степанович',  'ОХ'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('НСКВЦ',   'Насковец Михаил Трофимович', 'ТЛ'); 


create table SUBJECT
    (     SUBJECT  char(10) constraint SUBJECT_PK  primary key, 
           SUBJECT_NAME varchar(100) unique,
           PULPIT  char(20) constraint SUBJECT_PULPIT_FK foreign key 
                         references PULPIT(PULPIT)   
     )
 insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
                       values ('СУБД',   'Системы управления базами данных', 'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT)
                       values ('БД',     'Базы данных','ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT )
                       values ('ИНФ',    'Информационные технологии','ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT )
                       values ('ОАиП',  'Основы алгоритмизации и программирования', 'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT )
                       values ('ПЗ',     'Представление знаний в компьютерных системах', 'ИС-иТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT )
                       values ('ПСП',    'Программирование сетевых приложений', 'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT )
                       values ('МСОИ',  'Моделирование систем обработки информации', 'ИС-иТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT )
                       values ('ПИС',     'Проектирование информационных систем', 'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT )
                       values ('КГ',      'Компьютерная геометрия ','ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT )
           values ('ПМАПЛ',   'Полиграф. машины, автоматы и поточные линии', 'ПО-иСОИ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,  PULPIT )
                       values ('КМС',     'Компьютерные мультимедийные системы', 'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
                       values ('ОПП',     'Организация полиграф. производства', 'ПОиСОИ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT)
                       values ('ДМ',   'Дискретная математика', 'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,PULPIT )
                      values ('МП',   'Математическое программирование','ИСиТ');  
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
               values ('ЛЭВМ', 'Логические основы ЭВМ',  'ИСиТ');                   
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,PULPIT )
               values ('ООП',  'Объектно-ориентированное программирование', 'ИСиТ');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
                       values ('ЭП', 'Экономика природопользования','МиЭП')
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
                       values ('ЭТ', 'Экономическая теория','ЭТиМ')
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
                       values ('БЛЗиПсOO','Биология лесных зверей и птиц с осн. охотов.','ОВ')
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
                       values ('ОСПиЛПХ','Основы садово-паркового и лесопаркового хозяй-ства',  'ЛПиСПС')
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,PULPIT )
                       values ('ИГ', 'Инженерная геодезия ','ЛУ')
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,PULPIT )
                       values ('ЛВ',    'Лесоводство', 'ЛЗиДВ') 
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
                       values ('ОХ',    'Органическая химия', 'ОХ')   
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,PULPIT )
                       values ('ТРИ',    'Технология резиновых изделий','ТНХСиППМ') 
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
                       values ('ВТЛ',    'Водный транспорт леса','ТЛ')
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,PULPIT )
                       values ('ТиОЛ',   'Технология и оборудование лесозаготовок', 'ЛМиЛЗ') 
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,PULPIT )
                       values ('ТОПИ',   'Технология обогащения полезных ископаемых ','ТНВиОХТ')
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME, PULPIT )
                       values ('ПЭХ',    'Прикладная электрохимия','ХТЭПиМЭЕ')                                                                                                                                                           




create login student with password = 'fitfit';
create user student for login student;
alter role db_owner add member student;	--права владельца

