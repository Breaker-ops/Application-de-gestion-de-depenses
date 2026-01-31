from django.db import models
import uuid
class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, editable=False,default=uuid.uuid4)
    text = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateField(auto_now_add=True)

    class Meta :
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.description} - {self.amount}"