# MircoStack - AWS Microservices Deployment & DevOps Automation Platform

Design, deploy, and operationalize a production-grade microservices infrastructure on AWS using containerized services, automated CI/CD pipelines, managed databases, secure secret management, and domain routing.

The project demonstrates expertise in:

- AWS ECS (Fargate)
- Docker containerization
- GitHub Actions CI/CD
- AWS RDS
- AWS Route 53
- AWS Secrets Manager
- SSL/TLS automation
- Infrastructure documentation and operational handover

---

## Requirements

- AWS CLI
- Dcker engine
- Nodejs v22
- Python 3.12
- Golang 1.26

---

## Implementation

- **Networking:** Setup the VPC, subnet, route table, internet gateway, NAT and security groups on aws
- **Docker:** Create a private repository on ECR and build and push images to ECR. Can be created using the commands below

```bash
# Authenticate
aws ecr get-login-password -region eu-west-2 | \
sudo docker login --username AWS --password-stdin 226290659927.dkr.ecr.eu-west-2.amazonaws.com

# Create private repository
aws ecr create-repository --repository-name ecs-microstack-auth --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true --region eu-west-2

aws ecr create-repository --repository-name ecs-microstack-notes --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true --region eu-west-2

aws ecr create-repository --repository-name ecs-microstack-text --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true --region eu-west-2

aws ecr create-repository --repository-name ecs-microstack-frontend --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true --region eu-west-2

# Optional: Build, tag and push image to repository
# The build and push of docker image will be implemented by the pipeline.
sudo docker build -t 226290659927.dkr.ecr.eu-west-2.amazonaws.com/ecs-microstack-auth:latest .
sudo docker push 226290659927.dkr.ecr.eu-west-2.amazonaws.com/ecs-microstack-auth:latest

sudo docker build -t 226290659927.dkr.ecr.eu-west-2.amazonaws.com/ecs-microstack-notes:latest .
sudo docker push 226290659927.dkr.ecr.eu-west-2.amazonaws.com/ecs-microstack-notes:latest

sudo docker build -t 226290659927.dkr.ecr.eu-west-2.amazonaws.com/ecs-microstack-tesxt:latest .
sudo docker push 226290659927.dkr.ecr.eu-west-2.amazonaws.com/ecs-microstack-text:latest

sudo docker build -t 226290659927.dkr.ecr.eu-west-2.amazonaws.com/ecs-microstack-frontend:latest .
sudo docker push 226290659927.dkr.ecr.eu-west-2.amazonaws.com/ecs-microstack-frontend:latest
```

- **Database:** Create the RDS database Postgresql.
- **Target Group:** Create target group
- **Secret:** Create secret in secret manager
- **ECS:** Create cluster and task, then deploy the service in ECS

---

## Infrastructure

1. Login to aws console and setup the networking resources.
2. Create securiy group, target group and application load balancer
3. Create the RDS database resources
4. Setup the secret in AWS secret manager
5. Create the ECR and ECS resources

---

## Pipeline

The pipeline runs in stages as described below;

- `test.yaml`: Runs the test script for the microservice application on PR to dev branch.
- `codeql.yaml`: Analyze the code in the microservice application on PR to dev and main branch.
- `build.yaml`: Build, scan and perform a liveness test on the containerized microservice application on Merge to dev branch.
- `deploy.yaml`: Build and push docker image to ECR and deloy the microservice application to ECS on Merge to main branch based on changes in services folder.

---
