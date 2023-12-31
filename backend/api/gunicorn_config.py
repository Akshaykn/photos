import os

bind = "0.0.0.0:80"
workers = os.cpu_count() - 1
timeout = 120
