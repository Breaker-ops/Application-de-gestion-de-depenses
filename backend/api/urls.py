from django.urls import path
from . import views
urlpatterns = [
    path('transactions/', views.TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<uuid:id>/', views.TransactionRetreiveUpdateDestroyView.as_view(), name='transaction-detail'),
]