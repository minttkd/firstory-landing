"""원본 폰트(ttf/otf)에서 필요한 글자만 뽑아 웹용 woff2로 만든다.

사용법:
    pip install fonttools brotli
    python scripts/subset-font.py <원본 폰트> <출력 woff2> [--ksx1001]

예:
    python scripts/subset-font.py MemomentKkukkukk.ttf src/assets/fonts/MemomentKkukkukk.woff2

기본으로 포함하는 글자:
  - 기본 라틴/숫자/문장부호, 한글 자모
  - src/, index.html 안에서 실제로 쓰인 모든 글자
--ksx1001 옵션을 주면 한글 완성형 2,350자(일상 문구 대부분)를 추가로 넣어요. 용량이 크게 늘어요.

문구를 바꿨다면 이 스크립트를 다시 실행해주세요. 빠진 글자는 대체 폰트(Gaegu)로 보여요.
※ 폰트 라이선스가 수정을 금지하면 이 스크립트를 쓰지 말고 원본을 woff2로 변환만 하세요.
"""
import pathlib
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent


def ksx1001_hangul():
    chars = set()
    for lead in range(0xB0, 0xC9):
        for trail in range(0xA1, 0xFF):
            try:
                chars.add(bytes([lead, trail]).decode("euc-kr"))
            except UnicodeDecodeError:
                pass
    return chars


def used_in_project():
    chars = set()
    targets = list((ROOT / "src").rglob("*.jsx")) + list((ROOT / "src").rglob("*.js")) + [ROOT / "index.html"]
    for path in targets:
        chars.update(path.read_text(encoding="utf-8"))
    return {c for c in chars if not c.isspace()}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 2:
        print(__doc__)
        sys.exit(1)

    src, dst = pathlib.Path(args[0]), pathlib.Path(args[1])
    chars = set(map(chr, range(0x20, 0x7F)))  # 기본 라틴
    chars |= set(map(chr, range(0x3131, 0x3164)))  # 한글 호환 자모
    chars |= set("·…“”‘’—–•→←↑↓★☆♥♡✦✧©")
    if "--ksx1001" in sys.argv:
        chars |= ksx1001_hangul()
    chars |= used_in_project()

    font = TTFont(str(src))
    cmap = font.getBestCmap()
    missing = sorted(c for c in used_in_project() if ord(c) not in cmap and ord(c) > 0x7F)
    if missing:
        print("이 폰트에 없는 글자(대체 폰트로 표시돼요):", "".join(missing))

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True

    subsetter = subset.Subsetter(options)
    subsetter.populate(text="".join(sorted(chars)))
    subsetter.subset(font)

    dst.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(str(dst))
    print(f"{dst} ({dst.stat().st_size / 1024:.0f} KB), 글자 수 {len(chars)}")


if __name__ == "__main__":
    main()
