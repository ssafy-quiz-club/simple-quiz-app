# 🚀 KT Cloud 배포 체크리스트 (순서대로)

## 📍 현재 상태
- ✅ KT Cloud 서버 생성 (Rocky Linux 8.10)
- ✅ PuTTY로 SSH 접속 성공 (노트북에서)
- ✅ Root 계정 확인
- ❌ Docker 설치 (충돌 에러 발생)
- ❌ 포트 포워딩 설정 오류 (사설 포트 3389로 잘못됨)

---

## 🎯 전체 배포 순서

### **Step 1: KT Cloud 포트 포워딩 수정** ⬅️ **지금 해야 함!**

**KT Cloud 콘솔 접속:**
```
https://console.kt-cloud.com
로그인 > Server > 포트포워딩
```

**수정할 규칙 1:**
- 현재: `howmanytry | 사설 3389 | 공인 211.254.214.126 | 공인 8080`
- 수정: `howmanytry | 사설 8080 | 공인 211.254.214.126 | 공인 8080`
- 우측 "수정하기" 클릭 → 사설 포트 `3389`을 `8080`으로 변경 → 저장

**수정할 규칙 2:**
- 현재: `howmanytry | 사설 3389 | 공인 211.254.214.126 | 공인 80`
- 수정: `howmanytry | 사설 80 | 공인 211.254.214.126 | 공인 80`
- 우측 "수정하기" 클릭 → 사설 포트 `3389`을 `80`으로 변경 → 저장

**최종 포트 포워딩 목록:**
```
howmanytry    22      211.254.215.138    3322    tcp
howmanytry    22      211.254.215.138    22      tcp
howmanytry    80      211.254.214.126    80      tcp
howmanytry    8080    211.254.214.126    8080    tcp
```

---

### **Step 2: 데스크탑에서 SSH 접속 테스트** ⬅️ **포트 수정 후**

**PowerShell에서:**
```powershell
ssh -p 3322 root@211.254.215.138
```

**예상 결과:**
```
[root@howmanytry ~]#
```

✅ 성공하면 다음 단계로!

---

### **Step 3: Docker 설치** ⬅️ **SSH 접속 성공 후**

**PuTTY 또는 PowerShell에서 (서버에 접속한 상태):**

```bash
# 1. 시스템 업데이트
dnf update -y

# 2. EPEL 저장소 추가
dnf install -y epel-release

# 3. 기본 도구 설치
dnf install -y git curl wget vim net-tools

# 4. Docker 저장소 추가
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 5. Docker 설치 (Podman 충돌 해결)
dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin --allowerasing

# 6. Docker 시작
systemctl start docker
systemctl enable docker

# 7. 버전 확인
docker --version
docker compose version
```

**예상 결과:**
```
Docker version 24.0.x
Docker Compose version v2.x.x
```

✅ 버전이 나오면 성공!

---

### **Step 4: 서버 방화벽 설정** ⬅️ **Docker 설치 후**

**SSH에서:**
```bash
# 1. 방화벽 시작
systemctl start firewalld
systemctl enable firewalld

# 2. 포트 열기
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --permanent --add-port=3306/tcp

# 3. 적용
firewall-cmd --reload

# 4. 확인
firewall-cmd --list-all
```

**예상 결과:**
```
ports: 80/tcp 8080/tcp 3306/tcp
```

✅ 포트가 보이면 성공!

---

### **Step 5: SELinux 설정** ⬅️ **방화벽 설정 후**

**SSH에서:**
```bash
# 1. Permissive 모드로 변경
setenforce 0

# 2. 영구 적용
sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config

# 3. 확인
getenforce
```

**예상 결과:**
```
Permissive
```

---

### **Step 6: 프로젝트 파일 업로드** ⬅️ **서버 설정 완료 후**

**방법 1: SCP로 업로드 (데스크탑 PowerShell에서)**

```powershell
cd C:\Users\SSAFY\Downloads\hell

# 전체 프로젝트 업로드
scp -P 3322 -r simple-quiz-app root@211.254.215.138:~/
```

**방법 2: Git Clone (서버에서)**

```bash
cd ~
git clone https://github.com/your-username/simple-quiz-app.git
cd simple-quiz-app
```

**확인 (서버에서):**
```bash
ls -la ~/simple-quiz-app
```

---

### **Step 7: .env 파일 생성** ⬅️ **파일 업로드 후**

**SSH에서:**
```bash
cd ~/simple-quiz-app

cat > .env << 'EOF'
DB_HOST=172.27.0.190
DB_PORT=3306
DB_NAME=quiz_app_db
DB_USERNAME=quizuser
DB_PASSWORD=QuizApp2025!
BACKEND_PORT=8080
FRONTEND_PORT=80
EOF

# 확인
cat .env
```

---

### **Step 8: MySQL 컨테이너 실행** ⬅️ **.env 파일 생성 후**

**SSH에서:**
```bash
docker run -d \
  --name mysql \
  --restart unless-stopped \
  -e MYSQL_ROOT_PASSWORD=QuizApp2025! \
  -e MYSQL_DATABASE=quiz_app_db \
  -e MYSQL_USER=quizuser \
  -e MYSQL_PASSWORD=QuizApp2025! \
  -p 3306:3306 \
  mysql:8.0

# 로그 확인
docker logs mysql

# 상태 확인
docker ps
```

**예상 결과:**
```
CONTAINER ID   IMAGE       STATUS         PORTS                    NAMES
xxxxx          mysql:8.0   Up 10 seconds  0.0.0.0:3306->3306/tcp   mysql
```

---

### **Step 9: 백엔드 Docker 이미지 빌드** ⬅️ **MySQL 실행 후**

**SSH에서:**
```bash
cd ~/simple-quiz-app/backend

# Docker 이미지 빌드
docker build -t quiz-backend:latest .

# 확인
docker images | grep quiz-backend
```

---

### **Step 10: 백엔드 컨테이너 실행** ⬅️ **이미지 빌드 후**

**SSH에서:**
```bash
cd ~/simple-quiz-app

# docker-compose로 백엔드 실행
docker compose -f docker-compose-external-mysql.yml up -d backend

# 로그 확인
docker compose -f docker-compose-external-mysql.yml logs -f backend
```

**로그에서 확인할 내용:**
```
Started QuizAppApplication in X.XXX seconds
```

**Ctrl+C로 로그 빠져나온 후 상태 확인:**
```bash
docker ps
```

---

### **Step 11: 백엔드 API 테스트** ⬅️ **백엔드 실행 후**

**PowerShell에서 (데스크탑):**
```powershell
# Ping 테스트
Invoke-WebRequest -Uri http://211.254.214.126:8080/api/ping

# 예상 결과:
# StatusCode: 200
# Content: pong
```

**또는 브라우저에서:**
```
http://211.254.214.126:8080/api/ping
```

✅ "pong" 응답이 오면 성공!

---

### **Step 12: 프론트엔드 수정 (로컬에서)** ⬅️ **백엔드 테스트 성공 후**

**파일: `frontend/src/services/axiosInstance.ts`**

```typescript
const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development"
        ? "http://localhost:8080/api"
        : "http://211.254.214.126:8080/api",  // KT Cloud backend
    withCredentials: true,
});
```

**Git에 커밋 & 푸시:**
```bash
git add .
git commit -m "Update backend API URL for KT Cloud"
git push origin main
```

---

### **Step 13: GitHub Actions로 프론트엔드 배포** ⬅️ **프론트 수정 후**

**GitHub에서 확인:**
```
https://github.com/your-username/simple-quiz-app/actions
```

- Workflow 실행 확인
- 성공 확인 (녹색 체크)

**배포 확인 (브라우저):**
```
https://your-username.github.io/simple-quiz-app
```

---

### **Step 14: 전체 테스트** ⬅️ **모든 배포 완료 후**

**브라우저에서:**
1. GitHub Pages 프론트엔드 접속
2. 퀴즈 목록 확인
3. 퀴즈 생성 테스트
4. 답변 제출 테스트

**예상 동작:**
- 프론트엔드 (GitHub Pages) → 백엔드 (211.254.214.126:8080) → MySQL (172.27.0.190:3306)

---

## 📊 진행 상황 체크리스트

### 현재 진행 중
- [ ] Step 1: KT Cloud 포트 포워딩 수정
- [ ] Step 2: SSH 접속 테스트 (포트 3322)
- [ ] Step 3: Docker 설치
- [ ] Step 4: 방화벽 설정
- [ ] Step 5: SELinux 설정
- [ ] Step 6: 프로젝트 파일 업로드
- [ ] Step 7: .env 파일 생성
- [ ] Step 8: MySQL 컨테이너 실행
- [ ] Step 9: 백엔드 이미지 빌드
- [ ] Step 10: 백엔드 컨테이너 실행
- [ ] Step 11: 백엔드 API 테스트
- [ ] Step 12: 프론트엔드 수정
- [ ] Step 13: GitHub Actions 배포
- [ ] Step 14: 전체 테스트

---

## 🎯 지금 당장 해야 할 것

### **1순위: KT Cloud 콘솔에서 포트 포워딩 수정**
```
사설 3389 → 80 으로 변경
사설 3389 → 8080 으로 변경
```

### **2순위: PowerShell에서 SSH 접속 테스트**
```powershell
ssh -p 3322 root@211.254.215.138
```

### **3순위: Docker 설치 (SSH 접속 후)**
```bash
dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin --allowerasing
systemctl start docker
docker --version
```

---

**이 순서대로 하나씩 진행하세요!** 🚀

각 단계가 성공하면 다음 단계로 넘어가면 됩니다.
