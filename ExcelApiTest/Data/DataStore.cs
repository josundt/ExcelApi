using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using ExcelApiTest.Model;

namespace ExcelApiTest.Data
{
    public class DataStore : DbContext
    {
        public DataStore()
            : base("ExcelApiTestDb")
        {
            Database.SetInitializer(new PersonDbInitializer());
        }

        public DbSet<Person> Persons { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Configurations.Add(new PersonFluentConfiguration());
        }
    }

    public class PersonFluentConfiguration : EntityTypeConfiguration<Person>
    {
        public PersonFluentConfiguration()
        {
            ToTable("Person");
            HasKey(p => p.Id);
            Property(p => p.FirstName).HasMaxLength(50).IsRequired();
            Property(p => p.LastName).HasMaxLength(50).IsRequired();
            Property(p => p.BirthDate).IsRequired();
        }
    }

    public class PersonDbInitializer : CreateDatabaseIfNotExists<DataStore>
    {
        protected override void Seed(DataStore context)
        {
            context.Database.ExecuteSqlCommand(@"
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Dylan','Amanda','1976-03-02T19:38:53-08:00',1,1,706157),('Charles','Emerson','1967-08-31T23:13:06-07:00',1,0,1445458),('Justin','Shelly','1984-01-31T00:18:28-08:00',1,1,655027),('Troy','Bethany','1996-12-18T03:07:49-08:00',1,0,1130303),('Colby','Kiayada','1967-02-05T06:02:34-08:00',1,0,835833),('Noble','Judith','1952-05-14T07:49:27-07:00',1,0,927436),('Wayne','Felix','2007-09-26T12:30:55-07:00',1,1,872009),('Isaac','Hayden','1990-09-01T13:40:54-07:00',1,0,1139516),('Adam','Hilary','1991-06-15T13:38:43-07:00',1,1,743355),('Price','Allen','1956-01-12T11:09:24-08:00',1,1,430562);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Chase','Zoe','1979-05-20T19:59:28-07:00',1,0,1097495),('Wayne','Curran','1963-12-09T19:52:06-08:00',1,0,50969),('Francis','Daryl','1970-08-08T08:13:38-07:00',1,1,202257),('Nero','Hanae','1989-11-03T23:13:11-08:00',1,1,1408967),('Tucker','Christine','1973-08-10T09:15:03-07:00',1,0,508141),('Kibo','Brenna','1953-02-18T08:09:49-08:00',1,1,793503),('Amal','Knox','1954-11-28T10:44:46-08:00',1,0,212150),('David','Darryl','1996-03-23T04:56:30-08:00',1,0,1203753),('Paul','Mallory','1967-03-27T16:14:11-08:00',1,0,1011918),('Knox','Wallace','1980-09-03T00:53:07-07:00',1,0,1234665);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Fulton','Logan','1980-04-12T21:24:24-08:00',1,0,895628),('Burton','Vera','2001-11-08T22:08:53-08:00',1,0,478115),('Jamal','Francesca','1964-03-02T23:16:01-08:00',1,0,1061222),('Ezekiel','Grant','2008-01-04T21:34:55-08:00',1,0,1326006),('Emmanuel','Armando','1976-10-29T23:34:28-07:00',1,1,1025866),('Jordan','Ferris','1956-06-12T22:46:26-07:00',1,1,957705),('Reece','Fallon','2006-03-08T20:40:05-08:00',1,1,1408549),('Charles','Catherine','1989-02-24T02:10:41-08:00',1,0,681769),('Dieter','Clare','2002-03-07T19:54:34-08:00',1,1,294998),('Levi','Felicia','1988-12-14T17:17:31-08:00',1,0,315559);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Preston','Tasha','2001-03-11T22:11:04-08:00',1,0,1252667),('Avram','Oleg','2011-02-28T03:29:34-08:00',1,0,1366636),('Hu','Keely','1954-03-10T04:36:29-08:00',1,1,976411),('Jonas','Germane','2001-10-06T04:56:09-07:00',1,1,729633),('Amos','Pamela','1969-05-30T10:20:19-07:00',1,1,195129),('Brett','Thor','2002-05-21T11:52:34-07:00',1,1,941135),('Slade','Hiram','1986-07-25T19:24:30-07:00',1,0,416429),('Hu','Kitra','1985-11-29T13:13:12-08:00',1,1,201614),('Erich','Kasper','2005-02-02T20:31:01-08:00',1,1,1182520),('Judah','Raphael','1953-11-05T12:39:27-08:00',1,1,513260);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Carter','Blake','2001-06-10T09:22:59-07:00',1,0,1137086),('Carl','Cara','1971-07-14T21:06:26-07:00',1,0,843576),('Evan','Rae','1957-09-22T02:52:55-07:00',1,0,926021),('Micah','Mark','2015-04-01T16:24:58-07:00',1,0,368215),('Orson','Ivan','1996-01-13T10:42:15-08:00',1,1,514972),('Roth','Forrest','1958-02-18T11:53:03-08:00',1,0,1106334),('Barclay','Brandon','1996-03-04T12:15:28-08:00',1,1,186625),('Kasper','Jarrod','1961-10-18T09:05:19-08:00',1,0,860258),('Kirk','Lane','1967-11-17T14:27:20-08:00',1,1,512604),('Amery','Veronica','2003-12-02T22:58:12-08:00',1,0,840234);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Chadwick','Jerry','2000-06-15T02:44:43-07:00',1,1,1151549),('Craig','Hanna','1963-05-23T12:05:50-07:00',1,0,1022554),('Emery','Finn','2004-05-28T18:56:29-07:00',1,1,1413038),('Steel','Mikayla','1984-04-13T07:53:21-08:00',1,0,244244),('Michael','Hayfa','1985-05-26T06:39:47-07:00',1,0,1423925),('Mark','Davis','1957-03-31T07:46:00-08:00',1,1,576734),('Magee','Plato','2011-06-04T16:45:33-07:00',1,0,986532),('Geoffrey','Susan','2003-01-02T15:39:21-08:00',1,1,317616),('Kuame','Sonya','1954-08-19T03:22:12-07:00',1,0,526968),('Hunter','Ulric','2015-05-24T17:15:20-07:00',1,1,1214703);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Kibo','Roary','2008-10-05T13:18:38-07:00',1,1,334445),('Calvin','Jackson','2010-03-28T23:35:28-07:00',1,0,206994),('Forrest','Maris','1956-06-27T18:02:23-07:00',1,1,1150831),('Russell','Martena','2016-01-13T17:33:25-08:00',1,1,1273570),('Walker','David','1986-02-23T10:40:14-08:00',1,1,751335),('Hayes','Kirestin','1953-06-04T15:24:32-07:00',1,0,308846),('Hall','Rhona','1973-10-28T11:54:58-08:00',1,0,279485),('Callum','Donna','1992-03-12T12:21:18-08:00',1,1,1238629),('Rogan','Madonna','1962-12-05T04:30:38-08:00',1,0,553859),('Quinlan','Kenyon','2011-11-04T08:29:30-07:00',1,0,1073661);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Grady','Aline','2003-07-19T16:28:52-07:00',1,1,1257664),('Alvin','Kai','1961-10-02T16:25:11-08:00',1,1,213900),('Declan','Aiko','2007-03-15T07:43:23-07:00',1,0,553157),('Bruno','Wilma','2014-09-09T23:53:11-07:00',1,0,914515),('Asher','Danielle','1990-06-23T03:14:31-07:00',1,1,285083),('Kenyon','Yardley','2011-01-19T12:47:40-08:00',1,1,574042),('Hasad','April','2012-09-24T22:47:23-07:00',1,1,7181),('Oren','Rose','2003-06-28T11:31:58-07:00',1,1,426412),('Elvis','Phillip','2005-12-11T14:04:03-08:00',1,0,987328),('Chandler','Kessie','1970-03-25T00:32:35-08:00',1,1,135497);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Alan','Kellie','1996-06-23T12:02:27-07:00',1,0,1094029),('Ahmed','Lydia','1964-01-30T00:53:22-08:00',1,0,189192),('Graiden','Yeo','1973-12-16T12:54:30-08:00',1,0,32086),('Theodore','Declan','1959-05-13T12:35:49-07:00',1,0,885705),('Armando','MacKenzie','2008-12-07T11:49:21-08:00',1,0,132910),('Graiden','Ahmed','1990-07-06T22:16:53-07:00',1,1,650190),('Coby','Justina','2007-09-19T15:04:27-07:00',1,0,750842),('Wyatt','Lucy','1952-01-22T05:06:13-08:00',1,1,1106857),('Tyler','Laurel','1979-07-15T00:36:06-07:00',1,0,125084),('Jared','Herrod','1983-06-08T07:37:51-07:00',1,1,992207);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Raymond','Stacy','1951-05-08T12:08:34-07:00',1,1,371564),('Calvin','Daniel','1970-06-12T16:49:02-07:00',1,1,311565),('Hyatt','Natalie','1978-11-25T13:35:25-08:00',1,1,487431),('Gavin','Kevyn','1972-02-05T10:15:20-08:00',1,1,1191292),('Merrill','Nicole','2009-03-30T00:56:08-07:00',1,1,5903),('Tucker','Hall','1980-03-14T10:48:18-08:00',1,1,1312219),('Deacon','Hannah','1953-04-18T18:59:47-08:00',1,1,1370001),('Upton','Tashya','1999-05-06T00:03:28-07:00',1,0,816981),('Cameron','Edward','1983-05-24T15:05:13-07:00',1,0,902664),('Alvin','Kareem','1986-08-13T05:43:56-07:00',1,1,301077);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Jenette','Gannon','1999-12-10T00:03:17-08:00',2,1,842952),('Ulla','Zenaida','2000-11-17T15:16:43-08:00',2,1,1210479),('Jada','Nash','1984-05-28T03:24:45-07:00',2,1,108755),('Alisa','Ivana','1993-03-01T01:52:04-08:00',2,1,214044),('Jolie','Skyler','1993-10-24T12:32:21-07:00',2,1,685601),('Britanney','Rina','1965-09-04T04:35:43-07:00',2,1,1180467),('Rose','Minerva','1977-01-06T00:40:27-08:00',2,1,835825),('Lunea','Riley','1972-10-22T01:08:19-07:00',2,1,171068),('Daryl','Christian','1997-08-21T09:34:17-07:00',2,0,457103),('Anastasia','Noah','1968-08-19T11:16:53-07:00',2,1,1474868);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Brittany','Xaviera','1964-07-31T16:36:46-07:00',2,1,369046),('Aspen','Summer','1997-01-06T18:48:14-08:00',2,0,290456),('Allegra','Carla','1975-02-07T15:35:43-08:00',2,0,639978),('Rosalyn','Todd','1958-11-23T22:58:42-08:00',2,1,701418),('Charlotte','MacKensie','2010-11-26T07:12:01-08:00',2,1,371353),('Olympia','Jordan','1959-03-30T15:44:35-08:00',2,1,1450055),('Jorden','Herrod','1953-01-24T11:50:30-08:00',2,1,336650),('Mona','Orli','2004-08-21T22:11:18-07:00',2,1,334132),('Inez','Ignacia','1957-11-07T01:28:10-08:00',2,0,961997),('Hadassah','Quail','1952-03-13T02:18:24-08:00',2,1,2615);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Allegra','Ima','1967-08-06T11:05:41-07:00',2,0,416902),('Hiroko','Summer','1963-05-25T14:24:24-07:00',2,0,1037178),('Wendy','Jana','1964-03-24T09:27:43-08:00',2,0,821894),('Willow','Freya','1977-05-04T03:44:47-07:00',2,0,763996),('Mercedes','Mason','2005-05-14T04:56:11-07:00',2,0,1329783),('Amena','Orla','1973-10-11T00:18:09-07:00',2,1,114205),('Kalia','Kerry','1975-07-03T14:43:19-07:00',2,1,544421),('Chanda','Patricia','1963-07-21T19:54:01-07:00',2,1,1392730),('Noel','Robert','1980-12-06T06:36:19-08:00',2,1,473761),('Jacqueline','Xena','1955-03-29T17:41:22-08:00',2,1,1295079);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Jillian','Desirae','1993-10-03T07:08:49-07:00',2,0,754951),('Naomi','Prescott','1997-07-12T06:29:52-07:00',2,1,183904),('Whilemina','Kylynn','1977-03-15T02:07:24-08:00',2,0,191177),('Jacqueline','Isabelle','2004-09-12T10:11:57-07:00',2,1,738457),('Dakota','Daria','1956-12-23T06:43:19-08:00',2,1,1485232),('Alika','Lane','1983-06-23T14:17:57-07:00',2,1,1362409),('Hanna','Tiger','1977-05-15T16:00:39-07:00',2,1,796546),('Bethany','Kimberly','1987-10-22T16:27:49-07:00',2,1,1384412),('Dara','Melyssa','1995-03-16T15:40:13-08:00',2,0,740222),('Mona','Bert','1979-08-18T03:05:26-07:00',2,0,239475);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Ulla','Amethyst','1998-07-12T03:47:31-07:00',2,1,61073),('Kimberly','Tanisha','2003-11-02T12:21:18-08:00',2,1,1305863),('Lee','Mollie','1987-06-22T11:10:16-07:00',2,0,828761),('Bree','Maris','1965-09-05T09:44:08-07:00',2,0,1263203),('Debra','Cooper','2001-08-14T22:53:00-07:00',2,0,761334),('Deirdre','Candice','1956-05-22T13:28:37-07:00',2,0,709461),('Ruby','Inez','1970-03-13T13:23:32-08:00',2,0,1280172),('Neve','Uriah','1997-05-22T01:39:30-07:00',2,1,137888),('Keiko','Lillith','1990-10-29T09:32:00-08:00',2,1,1067653),('Paloma','Addison','2005-09-05T08:30:49-07:00',2,0,1271755);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Miriam','Kirby','2005-06-21T02:27:34-07:00',2,0,460760),('Allegra','Kiayada','2003-10-28T03:30:41-08:00',2,1,824214),('Meghan','Armand','1951-10-03T03:20:15-08:00',2,0,1093234),('Audrey','Evan','2007-10-01T09:49:00-07:00',2,0,707757),('Anika','Cathleen','1960-04-22T00:40:05-08:00',2,0,192305),('Christine','Leila','1997-08-31T00:50:10-07:00',2,1,727131),('Ocean','Murphy','2002-02-07T01:11:06-08:00',2,0,1227872),('Danielle','Xena','1964-02-15T13:10:51-08:00',2,0,1460731),('Hadassah','Harrison','1973-05-02T04:57:59-07:00',2,1,868818),('Fredericka','Maxine','1968-06-19T07:50:15-07:00',2,1,313975);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Zenaida','Byron','1964-01-14T08:22:54-08:00',2,0,1471967),('Maggie','Christopher','1988-10-07T19:13:13-07:00',2,0,649154),('Isabelle','Brynn','1987-12-22T13:15:40-08:00',2,1,1199572),('Blossom','Katell','1966-11-28T17:22:27-08:00',2,0,1311653),('Cheryl','Avye','1995-12-06T11:27:00-08:00',2,0,21124),('Kalia','Ray','1986-11-21T13:10:34-08:00',2,0,95532),('Stella','Galena','1989-04-17T22:42:55-07:00',2,0,1113593),('Cassady','Zephr','2007-08-17T01:26:15-07:00',2,1,129570),('Morgan','McKenzie','1994-05-02T09:45:39-07:00',2,0,449805),('Elizabeth','Brianna','1975-12-11T20:24:20-08:00',2,0,674225);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Jacqueline','Oscar','1983-12-15T08:38:08-08:00',2,1,962017),('Cecilia','Hedwig','2001-05-17T14:01:56-07:00',2,1,414394),('Jocelyn','Madeson','2008-08-05T00:31:32-07:00',2,0,624239),('Aspen','Farrah','1970-03-28T06:17:01-08:00',2,1,259763),('Tamekah','Alma','1956-03-18T02:14:40-08:00',2,0,864960),('Savannah','Nola','1995-11-22T23:16:48-08:00',2,0,930799),('Summer','Felicia','1952-04-26T02:09:45-08:00',2,1,558207),('Vanna','Martha','2014-04-03T09:59:47-07:00',2,0,976397),('Glenna','Rosalyn','1963-07-30T19:05:26-07:00',2,0,847138),('Jaime','Jorden','1991-02-09T16:44:48-08:00',2,0,1135028);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Risa','Holly','1971-04-28T15:22:02-07:00',2,0,1490283),('Inga','Buckminster','2012-06-24T20:27:53-07:00',2,1,1153276),('Kitra','Lareina','2002-05-05T18:15:13-07:00',2,0,94398),('Martha','Mona','1955-04-14T19:47:25-08:00',2,1,1219693),('Zenia','Ann','1970-03-15T12:34:22-08:00',2,1,317526),('Kevyn','Mohammad','2007-01-07T04:23:54-08:00',2,1,1220775),('Claudia','Wilma','1973-10-16T11:00:12-07:00',2,0,1310263),('Aspen','Caryn','1961-12-17T08:35:56-08:00',2,1,1459184),('Inga','Shaine','1984-03-25T11:29:23-08:00',2,1,1155664),('Rhonda','Emma','1974-04-06T20:27:26-07:00',2,1,1282992);
INSERT INTO Person([FirstName],[LastName],[BirthDate],[Gender],[IsStudent],[YearlyIncome]) VALUES('Chiquita','Kirk','1959-03-18T01:53:45-08:00',2,0,1100461),('Dorothy','Chandler','1989-06-25T17:31:44-07:00',2,0,1259462),('Britanney','Arsenio','2011-08-04T02:53:41-07:00',2,1,68362),('Kylan','Cole','1973-02-11T11:01:54-08:00',2,0,775414),('Jolie','Zelda','1963-06-17T15:51:49-07:00',2,0,172037),('Angelica','Briar','1961-05-06T02:43:10-07:00',2,1,1405105),('Sigourney','Silas','1957-09-13T02:41:19-07:00',2,0,288972),('Cheyenne','Orson','1988-11-25T14:41:17-08:00',2,0,480489),('Natalie','Brady','1986-09-04T05:46:11-07:00',2,1,641771),('Ramona','Brent','1960-10-19T10:23:40-08:00',2,0,1341994);
");
        //    IList<Person> persons = new List<Person>
        //    {
        //        new Person
        //        {
        //            FirstName = "John", 
        //            LastName = "Doe", 
        //            BirthDate = new DateTimeOffset(1973, 2, 4, 0, 0, 0, TimeSpan.FromTicks(0)),
        //            Gender = Gender.Male,
        //            IsStudent = false,
        //            YearlyIncome = 100000M
        //        },
        //        new Person
        //        {
        //            FirstName = "Lisa", 
        //            LastName = "Doe", 
        //            BirthDate = new DateTimeOffset(1976, 11, 27, 0, 0, 0, TimeSpan.FromTicks(0)),
        //            Gender = Gender.Female,
        //            IsStudent = false,
        //            YearlyIncome = 80000M
        //        },
        //        new Person
        //        {
        //            FirstName = "Kid", 
        //            LastName = "Doe", 
        //            BirthDate = new DateTimeOffset(2005, 6, 16, 0, 0, 0, TimeSpan.FromTicks(0)),
        //            Gender = Gender.Male,
        //            IsStudent = true,
        //            YearlyIncome = 0
        //        }
        //    };


        //    foreach (Person person in persons)
        //        context.Persons.Add(person);

            base.Seed(context);
        }
    }

}
