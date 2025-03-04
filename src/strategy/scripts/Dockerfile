# Use a slim but powerful base image with AWS Lambda support
FROM public.ecr.aws/lambda/python:3.11

# Set up a working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install system dependencies (for scipy, numpy, pandas, etc.)
RUN yum install -y \
        gcc \
        gcc-c++ \
        make \
        cmake \
        python3-devel \
        lapack-devel \
        blas-devel \
        && yum clean all

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the application code (Lambda function or Cloud Run app)
COPY . .

# Command to run AWS Lambda handler (for Lambda) or main.py (for Cloud Run)
CMD ["lambda_function.lambda_handler"]
