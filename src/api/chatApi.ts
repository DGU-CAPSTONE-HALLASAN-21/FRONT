import axios from "axios";
// 백엔드 자동완성 및 채팅 호출 URL
const AUTO_ENDPOINT = "http://localhost:8080/auto";

// 자동완성 요청하기
export const getAutoComplete = async (currentInput: string) => {
  try {
    // axios는 기본적으로 JSON을 보내려고 하므로, text/plain 헤더를 명시해줍니다.
    const res = await axios.post(AUTO_ENDPOINT, currentInput, {
      headers: { "Content-Type": "text/plain" },
    });

    // fetch와 달리 .ok 확인 과정이 필요 없고, 데이터는 res.data에 바로 들어있습니다.
    const full = res.data;

    // 1) full에서 trimmed가 시작되는 위치
    const idx = full.indexOf(currentInput);
    // 2) 그 뒤 부분만 잘라내기
    const suffix = idx >= 0 ? full.slice(idx + currentInput.length) : full;
    // 1) 제안 문자열 앞뒤 공백을 trim 하고
    const pure = suffix.trimStart();
    // (중요!) 여기 한 번만 호출해서 반드시 NBSP 치환된 문자열을 셋팅
    return pure;
  } catch (err) {
    // axios는 400, 500 에러 발생 시 자동으로 여기 catch로 넘어옵니다.
    console.error("Autocomplete error:", err);
    throw err;
  }
};

// 질의응답 요청하기
export const getAnswer = async (currentInput: string) => {
  try {
    // axios는 기본적으로 JSON을 보내려고 하므로, text/plain 헤더를 명시해줍니다.
    const res = await axios.post(
      `http://localhost:8080/folders/1/chats/1`,
      currentInput,
      {
        headers: { "Content-Type": "text/plain" },
      }
    );

    // fetch와 달리 .ok 확인 과정이 필요 없고, 데이터는 res.data에 바로 들어있다.
    return res.data;
  } catch (err) {
    // axios는 400, 500 에러 발생 시 자동으로 여기 catch로 넘어옵니다.
    console.error("Autocomplete error:", err);
    throw err;
  }
};
