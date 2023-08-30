import os
import magic
from django.core.exceptions import ValidationError


def validate_is_las(file):
    valid_mime_types = ['application/octet-stream']
    file_mime_type = magic.from_buffer(file.read(1024), mime=True)
    if file_mime_type not in valid_mime_types:
        raise ValidationError('Неподдерживаемый тип файла')
    valid_file_extensions = ['.las']
    ext = os.path.splitext(file.name)[1]
    if ext.lower() not in valid_file_extensions:
        raise ValidationError('Неподдерживаемый формат файла')
