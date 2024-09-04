# Use the official Python image.
FROM python:3.9

# Create and set the working directory
WORKDIR /code

# Copy any dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy the code into the container
COPY . /code

# Default command to run
CMD ["python", "script.py"]
