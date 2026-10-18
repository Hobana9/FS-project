"""Заполнение базы демонстрационными данными.

Запуск из каталога backend:  python -m app.db.seed
Повторный запуск ничего не делает, если данные уже есть.
"""

from datetime import date

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models import Defect, DefectSeverity, DefectType, RepairTask, TaskStatus, Upload, UploadStatus


def seed() -> None:
    with SessionLocal() as db:
        if db.scalar(select(Upload).limit(1)) is not None:
            print('В базе уже есть данные, заполнение пропущено')
            return

        lenina = Upload(
            street='проспект Ленина',
            section='д. 42 — д. 56',
            captured_at=date(2026, 9, 14),
            uploaded_by='Соколов А. В.',
            photo_url='/photos/section-1.jpg',
            status=UploadStatus.processed,
            defects=[
                Defect(
                    type=DefectType.faded_line,
                    severity=DefectSeverity.high,
                    wear_percent=78,
                    length_m=24,
                    task=RepairTask(
                        crew='Бригада №1',
                        due_date=date(2026, 9, 25),
                        status=TaskStatus.in_progress,
                        comment='Нанести осевую линию заново на всём отрезке',
                    ),
                ),
                Defect(
                    type=DefectType.gap,
                    severity=DefectSeverity.medium,
                    wear_percent=45,
                    length_m=6,
                    task=RepairTask(
                        crew='Бригада №1',
                        due_date=date(2026, 9, 19),
                        status=TaskStatus.done,
                        comment='Работы приняты инспектором',
                    ),
                ),
            ],
        )

        gagarina = Upload(
            street='улица Гагарина',
            section='перекрёсток с ул. Мира',
            captured_at=date(2026, 9, 16),
            uploaded_by='Терехова М. И.',
            photo_url='/photos/section-2.jpg',
            status=UploadStatus.processed,
            defects=[
                Defect(
                    type=DefectType.gap,
                    severity=DefectSeverity.high,
                    wear_percent=91,
                    length_m=4,
                    task=RepairTask(
                        crew='Бригада №3',
                        due_date=date(2026, 9, 22),
                        status=TaskStatus.new,
                    ),
                ),
                Defect(
                    type=DefectType.faded_line,
                    severity=DefectSeverity.low,
                    wear_percent=22,
                    length_m=11,
                ),
            ],
        )

        severnoe = Upload(
            street='Северное шоссе',
            section='3-й км',
            captured_at=date(2026, 9, 18),
            uploaded_by='Соколов А. В.',
            photo_url='/photos/section-3.jpg',
            status=UploadStatus.processing,
        )

        db.add_all([lenina, gagarina, severnoe])
        db.commit()
        print('Демонстрационные данные добавлены')


if __name__ == '__main__':
    seed()
