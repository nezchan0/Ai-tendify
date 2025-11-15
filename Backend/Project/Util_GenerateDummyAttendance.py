#!/usr/bin/env python3
"""
generate_attendance_single_csv.py

Generates randomized attendance for the last N days into a single CSV file.

Output:
    attendance_last_30_days.csv
"""

import csv
import random
from pathlib import Path
from datetime import date, timedelta

# CONFIG
TIMETABLE_CSV = Path("Util_timetables_strict.csv")
OUTPUT_FILE = Path("attendance_last_30_days.csv")
DAYS = 30
WEEKDAYS_ONLY = False

# Branch → ID
BRANCH_PREFIX = {"CSE": "CS", "ECE": "EC", "CIV": "CV", "MEE": "ME"}

# Admission year per semester
ADMISSION_BY_SEM = {2:25, 4:24, 6:23, 8:22}

# Attendance probability by semester (requested)
SEM_ATTENDANCE_PROB = {
    2: 0.85,   # 85% for sem 2
    4: 0.50,   # 50% for sem 4
    6: 0.70,   # 70% for sem 6
    8: 0.35,   # 35% for sem 8
}

# DAY mapping (NOW FULL DAY NAMES)
DAY_NAME_FULL = {
    0: "MONDAY",
    1: "TUESDAY",
    2: "WEDNESDAY",
    3: "THURSDAY",
    4: "FRIDAY",
    5: "SATURDAY",
    6: "SUNDAY"
}

DAY_PREFIX = {
    0: "MON",
    1: "TUE",
    2: "WED",
    3: "THU",
    4: "FRI",
    5: "SAT",
    6: "SUN"
}

def load_timetable(path):
    timetable = []
    with path.open() as f:
        reader = csv.DictReader(f)
        for r in reader:
            timetable.append(r)
    return timetable

def parse_class_id(cid):
    """
    Parse Class_ID like 'CSE2A' -> ('CSE', 2, 'A')
    """
    for i, ch in enumerate(cid):
        if ch.isdigit():
            branch = cid[:i]
            sem = int(cid[i])
            section = cid[i+1:]
            return branch, sem, section
    return None, None, None

def build_students_from_timetable(timetable):
    class_ids = sorted({r["Class_ID"] for r in timetable})
    students = {}

    for cid in class_ids:
        branch, sem, section = parse_class_id(cid)
        abbr = BRANCH_PREFIX[branch]
        adm_year = ADMISSION_BY_SEM[sem]

        if section == "A":
            rolls = range(1, 11)
        else:
            rolls = range(11, 21)

        students[cid] = [f"CLGS{adm_year:02d}{abbr}{r:03d}" for r in rolls]

    return students

def sessions_for_day(timetable, day_prefix):
    return sorted({r["Session_ID"] for r in timetable if r["Session_ID"].startswith(day_prefix)})

def build_timetable_map(timetable):
    return {(r["Class_ID"], r["Session_ID"]): r["TSA_ID"] for r in timetable}

def get_attendance_prob_for_class(class_id):
    """
    Derive semester from class_id and return the configured attendance probability.
    Default fallback is 0.85 if unknown (safe).
    """
    _, sem, _ = parse_class_id(class_id)
    return SEM_ATTENDANCE_PROB.get(sem, 0.85)

def generate_attendance_for_date(att_date, timetable, students_per_class):
    weekday = att_date.weekday()
    day_prefix = DAY_PREFIX[weekday]       # e.g., "FRI"
    day_full = DAY_NAME_FULL[weekday]      # e.g., "FRIDAY"

    sessions = sessions_for_day(timetable, day_prefix)
    tmap = build_timetable_map(timetable)

    # deterministic RNG seeded by date so repeated runs produce same output for same date
    rnd = random.Random(int(att_date.strftime("%Y%m%d")))
    formatted_date = att_date.strftime("%m/%d/%Y")

    rows = []
    for class_id, studs in students_per_class.items():
        # get probability for this class (based on semester)
        prob = get_attendance_prob_for_class(class_id)

        for session in sessions:
            tsa = tmap.get((class_id, session))
            if tsa is None:
                continue

            for sid in studs:
                status = "TRUE" if rnd.random() < prob else "FALSE"

                rows.append([
                    formatted_date,  # MM/DD/YYYY
                    day_full,        # FULL day name (e.g., FRIDAY)
                    sid,             # Student_ID
                    session,         # Session_ID
                    class_id,        # Class_ID
                    tsa,             # TSA_ID
                    status           # TRUE/FALSE
                ])

    return rows

def main():
    timetable = load_timetable(TIMETABLE_CSV)
    students = build_students_from_timetable(timetable)

    all_rows = []
    today = date.today()

    for delta in range(1, DAYS + 1):
        d = today - timedelta(days=delta)

        if WEEKDAYS_ONLY and d.weekday() == 6:
            continue

        daily_rows = generate_attendance_for_date(d, timetable, students)
        all_rows.extend(daily_rows)
        print(f"Generated {len(daily_rows)} rows for {d}")

    # Write combined CSV
    with OUTPUT_FILE.open("w", newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["srno", "Date", "Day", "Student_ID", "Session_ID", "Class_ID", "TSA_ID", "Status"])

        sr = 1
        for r in all_rows:
            writer.writerow([sr] + r)
            sr += 1

    print("\n✓ DONE")
    print("Total rows:", len(all_rows))
    print("Output file:", OUTPUT_FILE.absolute())


if __name__ == "__main__":
    main()
