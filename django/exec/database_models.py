class DayDistrict:
    def __init__(self):
        self.id = 0
        self.date = ""
        self.district = ""

class BuilderIdDayDistrict:
    def set_id(self, item):
        self.record.id = item
        return self

    def set_date(self, item):
        self.record.date = item
        return self

    def set_district(self, item):
        self.record.district = item
        return self
    
    def build(self):
        return self.record

class CovidDeathDayDistrict(DayDistrict):
    def __init__(self):
        super().__init__()
        self.deaths_day = 0
        self.deaths_alltime = 0

    class Builder(BuilderIdDayDistrict):
        def __init__(self):
            self.record = CovidDeathDayDistrict()

        def set_deaths_day(self, item):
            self.record.deaths_day = item
            return self

        def set_deaths_alltime(self, item):
            self.record.deaths_alltime = item
            return self

class CovidInfectionDayDistrict(DayDistrict):
    def __init__(self):
        super().__init__()
        self.infections_new = 0
        self.infections_active = 0
        self.infections_new_7 = 0
        self.infections_new_14 = 0
        self.infections_new_65_age = 0

    class Builder(BuilderIdDayDistrict):
        def __init__(self):
            self.record = CovidInfectionDayDistrict()

        def set_infections_new(self, item):
            self.record.infections_new = item
            return self

        def set_infections_active(self, item):
            self.record.infections_active = item
            return self

        def set_infections_new_7(self, item):
            self.record.infections_new_7 = item
            return self

        def set_infections_new_14(self, item):
            self.record.infections_new_14 = item
            return self

        def set_infections_new_65_age(self, item):
            self.record.infections_new_65_age = item
            return self

class CovidVaccinationDayDistrict(DayDistrict):
    def __init__(self):
        super().__init__()
        self.dose_1_day = 0
        self.dose_1_alltime = 0
        self.dose_2_day = 0
        self.dose_2_alltime = 0
        self.dose_3_day = 0
        self.dose_3_alltime = 0
        self.dose_4_day = 0
        self.dose_4_alltime = 0
        self.doses_day = 0
        self.doses_alltime = 0

    class Builder(BuilderIdDayDistrict):
        def __init__(self):
            self.record = CovidVaccinationDayDistrict()

        def set_dose_1_day(self, item):
            self.record.dose_1_day = item
            return self

        def set_dose_1_alltime(self, item):
            self.record.dose_1_alltime = item
            return self

        def set_dose_2_day(self, item):
            self.record.dose_2_day = item
            return self

        def set_dose_2_alltime(self, item):
            self.record.dose_2_alltime = item
            return self

        def set_dose_3_day(self, item):
            self.record.dose_3_day = item
            return self

        def set_dose_3_alltime(self, item):
            self.record.dose_3_alltime = item
            return self

        def set_dose_4_day(self, item):
            self.record.dose_4_day = item
            return self

        def set_dose_4_alltime(self, item):
            self.record.dose_4_alltime = item
            return self

        def set_doses_day(self, item):
            self.record.doses_day = item
            return self

        def set_doses_alltime(self, item):
            self.record.doses_alltime = item
            return self

class CovidPcrTestDayDistrict(DayDistrict):
    def __init__(self):
        super().__init__()
        self.tests_new = 0
        self.tests_alltime = 0
        self.tests_new_correction = 0
        self.tests_alltime_correction = 0
        
    class Builder(BuilderIdDayDistrict):
        def __init__(self):
            self.record = CovidPcrTestDayDistrict()
        
        def set_tests_new(self, item):
            self.record.tests_new = item
            return self
        
        def set_tests_alltime(self, item):
            self.record.tests_alltime = item
            return self
        
        def set_tests_new_correction(self, item):
            self.record.tests_new_correction = item
            return self
        
        def set_tests_alltime_correction(self, item):
            self.record.tests_alltime_correction = item
            return self