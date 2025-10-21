import instance from "./axiosInstance";

const API_URL = "/questions"; // 백엔드에서 /api/questions와 일치

// 서버 핑 테스트
export const pingServer = () => {
    return instance
        .get("/ping")
        .then((response) => response.data)
        .catch((error) => {
            console.error("서버 핑 실패", error);
            throw error;
        });
};

// 모든 퀴즈 문제 가져오기
export const getAllQuestions = () => {
    return instance
        .get(API_URL)
        .then((res) => res.data)
        .catch((err) => {
            console.error("퀴즈 목록 불러오기 실패", err);
            throw err;
        });
};

// 특정 퀴즈 문제 가져오기
export const getQuestion = (id: number) => {
    return instance
        .get(`${API_URL}/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            console.error(`퀴즈 ${id} 불러오기 실패`, err);
            throw err;
        });
};

// 새 퀴즈 문제 생성
export const createQuestion = (questionData: any) => {
    return instance
        .post(API_URL, questionData)
        .then((res) => res.data)
        .catch((err) => {
            console.error("퀴즈 생성 실패", err);
            throw err;
        });
};

// 특정 문제의 답변 목록 가져오기
export const getAnswersForQuestion = (questionId: number) => {
    return instance
        .get(`${API_URL}/${questionId}/answers`)
        .then((res) => res.data)
        .catch((err) => {
            console.error(`문제 ${questionId}의 답변 불러오기 실패`, err);
            throw err;
        });
};

// 특정 문제에 답변 추가
export const addAnswerToQuestion = (questionId: number, answerData: any) => {
    return instance
        .post(`${API_URL}/${questionId}/answers`, answerData)
        .then((res) => res.data)
        .catch((err) => {
            console.error(`문제 ${questionId}에 답변 추가 실패`, err);
            throw err;
        });
};
