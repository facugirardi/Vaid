# Generated by Django 4.2.13 on 2024-11-05 22:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('user_type', models.IntegerField(default=1)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('is_completed', models.BooleanField(default=False)),
                ('is_form', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Donation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(default='General donation', max_length=255)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('quantity', models.IntegerField(default=0)),
                ('type', models.CharField(max_length=255)),
                ('file', models.FileField(blank=True, null=True, upload_to='donations/')),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('date', models.DateField()),
                ('endDate', models.DateField()),
                ('time', models.TimeField()),
                ('endTime', models.TimeField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='task_images/')),
                ('state', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Headquarter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Inventory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Headquarter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.headquarter')),
            ],
        ),
        migrations.CreateModel(
            name='NewsletterSubscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('subscribed_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Operation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(default='Regular operation', max_length=255)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('time', models.TimeField(default=django.utils.timezone.now)),
                ('quantity', models.IntegerField(default=0)),
                ('amount', models.IntegerField(default=0)),
                ('type', models.CharField(default='', max_length=255)),
                ('invoice', models.FileField(blank=True, null=True, upload_to='invoices/')),
            ],
        ),
        migrations.CreateModel(
            name='OperationType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('website', models.CharField(max_length=255)),
                ('User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone_number', models.CharField(default='000-000-0000', max_length=255)),
                ('address', models.CharField(default='', max_length=255)),
                ('disponibility', models.CharField(default='', max_length=255)),
                ('born_date', models.DateField(default=django.utils.timezone.now)),
                ('country', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('profession', models.CharField(blank=True, max_length=255, null=True)),
                ('experience', models.TextField(blank=True, null=True)),
                ('street_name', models.CharField(blank=True, max_length=255, null=True)),
                ('street_number', models.CharField(blank=True, max_length=255, null=True)),
                ('city', models.CharField(blank=True, max_length=255, null=True)),
                ('available_days', models.JSONField(default=list)),
                ('available_times', models.JSONField(default=list)),
                ('modality', models.CharField(blank=True, max_length=255, null=True)),
                ('topics', models.CharField(blank=True, max_length=255, null=True)),
                ('goals', models.TextField(blank=True, null=True)),
                ('motivations', models.TextField(blank=True, null=True)),
                ('User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('expDate', models.DateField(default=None, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ProductCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='ProductStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('isAdmin', models.BooleanField()),
                ('Organization', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
            ],
        ),
        migrations.CreateModel(
            name='TagType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('date', models.DateField()),
                ('endDate', models.DateField()),
                ('time', models.TimeField()),
                ('endTime', models.TimeField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='task_images/')),
                ('state', models.CharField(max_length=255)),
                ('Organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
            ],
        ),
        migrations.CreateModel(
            name='UserType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Usertype', models.CharField(max_length=255)),
                ('permission_level', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.CharField(default='Video content', max_length=255)),
                ('video_file', models.FileField(blank=True, null=True, upload_to='videos/')),
                ('Organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
            ],
        ),
        migrations.CreateModel(
            name='TaskTagDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.tag')),
                ('Task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.task')),
            ],
        ),
        migrations.CreateModel(
            name='TaskPersonDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.person')),
                ('Task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.task')),
            ],
        ),
        migrations.CreateModel(
            name='ProductInventoryDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cuantity', models.IntegerField()),
                ('Inventory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.inventory')),
                ('Product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.product')),
            ],
        ),
        migrations.AddField(
            model_name='product',
            name='Category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.productcategory'),
        ),
        migrations.AddField(
            model_name='product',
            name='Status',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.productstatus'),
        ),
        migrations.CreateModel(
            name='PersonTagDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.person')),
                ('Tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.tag')),
            ],
        ),
        migrations.CreateModel(
            name='PersonOrganizationDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
                ('Person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.person')),
            ],
        ),
        migrations.CreateModel(
            name='OperationProductDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=0)),
                ('Operation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.operation')),
                ('Product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.product')),
            ],
        ),
        migrations.AddField(
            model_name='operation',
            name='Organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization'),
        ),
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.BooleanField(default=False)),
                ('Event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.event')),
            ],
        ),
        migrations.CreateModel(
            name='Income',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(default='Ingreso general', max_length=255)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('category', models.CharField(max_length=255)),
                ('file', models.FileField(blank=True, null=True, upload_to='incomes_files/')),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images/')),
                ('alt', models.CharField(default='logo', max_length=255)),
                ('User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('Organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
            ],
        ),
        migrations.AddField(
            model_name='headquarter',
            name='Organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization'),
        ),
        migrations.CreateModel(
            name='Guest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('role', models.CharField(max_length=255)),
                ('Event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.event')),
            ],
        ),
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(default='Gasto general', max_length=255)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('category', models.CharField(max_length=255)),
                ('file', models.FileField(blank=True, null=True, upload_to='expenses_files/')),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
            ],
        ),
        migrations.CreateModel(
            name='EventReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('Event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.event')),
                ('User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='EventPersonDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.event')),
                ('Person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.person')),
            ],
        ),
        migrations.AddField(
            model_name='event',
            name='Organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization'),
        ),
        migrations.CreateModel(
            name='DonationProductDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=0)),
                ('Donation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.donation')),
                ('Product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.product')),
            ],
        ),
        migrations.AddField(
            model_name='donation',
            name='Organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization'),
        ),
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('interviewed', models.BooleanField(default=False)),
                ('request_date', models.DateField(default=django.utils.timezone.now)),
                ('Organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.organization')),
                ('Person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.person')),
            ],
        ),
    ]
