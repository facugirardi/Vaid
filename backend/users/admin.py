from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(UserAccount)

admin.site.register(Organization)

admin.site.register(Person)

admin.site.register(Task)
admin.site.register(TaskPersonDetails)

admin.site.register(Event)
admin.site.register(EventPersonDetails)

admin.site.register(Tag)
admin.site.register(TagType)

admin.site.register(PersonTagDetails)
admin.site.register(TaskTagDetails)
# admin.site.register(EventTagDetails)