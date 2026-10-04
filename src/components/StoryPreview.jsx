import './StoryPreview.css'

export default function StoryPreview() {
  return (
    <section className="section" id="story">
      <div className="container story-inner">
        <div className="story-copy reveal">
          <p className="eyebrow">동화 미리보기</p>
          <h2 className="section-title">이야기 속 질문이 대화의 문을 열어줘요</h2>
          <p className="section-desc">
            동화에는 등장인물의 상황과 감정을 이야기해볼 수 있는 질문이 함께 담겨요. 아이는 “나”가 아닌 “토리”의
            이야기라서 부담 없이 마음을 꺼낼 수 있어요.
          </p>
          <p className="story-note">* 아래는 이해를 돕기 위한 예시 화면입니다.</p>
        </div>

        <div className="phone reveal" aria-label="동화 화면 예시">
          <div className="phone-screen">
            <p className="story-tag">예시 · 처음 가는 유치원</p>
            <div className="story-art" aria-hidden="true">
              🐻🏫
            </div>
            <p className="story-text">
              내일은 토리가 처음으로 유치원에 가는 날이에요. 신발을 신는 토리의 가슴이 콩닥콩닥 뛰었어요.
            </p>
            <div className="story-question">
              <span>💬 함께 이야기해요</span>
              <p>토리는 지금 어떤 기분일까? 너도 그런 적 있어?</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
