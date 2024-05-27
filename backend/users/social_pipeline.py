from django.contrib.auth import get_user_model

User = get_user_model()

def associate_user_by_email(strategy, details, backend, user=None, *args, **kwargs):
    if user:
        return {'is_new': False, 'user': user}
    email = details.get('email')
    try:
        user = strategy.storage.user.get_user(email=email)
        return {
            'is_new': False,
            'user': user
        }
    except User.DoesNotExist:
        return None
