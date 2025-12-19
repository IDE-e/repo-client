# repo-client

with Next.js

<br/>

### Docker 명령어

```
1. docker build -t -repo-client
2. docker build -t repo-client . (현재 폴더를 빌드하려면 끝에 .을 붙여야한다.)
3. docker images | findstr repo-client (이미지 생겼는지 확인)

```

##### 1. 빌드 + 로컬에 이미지 로드

`1. docker buildx build --progress=plain --load -t repo-client:latest .`

##### 2. 이미지 확인 & 실행

```
docker images | findstr repo-client
docker run --rm -p 3000:3000 repo-client:latest
```

<br/>

### Dokcer Compose

##### 실행

`docker compose up`

<br/>

### Kubernetes로 “배포/스케일/자동복구”

##### 1. 클러스터 만들기

```
kind create cluster
kubectl get nodes
```

##### 2. 로컬 이미지(kind로) 로드

`kind load docker-image repo-client:latest`

##### 3. Deployment + Service 올리기 (k8s.yaml 생성)

##### 4. 적용

```
!그 전에!
Docker Desktop의 Kubernetes 켜기 (가장 쉬운 루트)
Docker Desktop 실행
Settings → Kubernetes → “Enable Kubernetes” 체크
Apply & Restart
```

```
kubectl apply -f k8s.yaml
kubectl get pods
kubectl get svc
```

##### 5. 접속 (포트포워딩)

`kubectl port-forward svc/repo-client 3000:80`
