import sys
import asyncio
import edge_tts

async def main():
    if len(sys.argv) < 3:
        print("Usage: python neural_tts.py <text_file> <output_file> [voice] [rate] [pitch]")
        sys.exit(1)
        
    text_file = sys.argv[1]
    output_file = sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] else "bn-BD-NabanitaNeural"
    rate = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] else "+0%"
    pitch = sys.argv[5] if len(sys.argv) > 5 and sys.argv[5] else "+0Hz"
    
    with open(text_file, "r", encoding="utf-8") as f:
        text = f.read().strip()
        
    if not text:
        sys.exit(0)
        
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await communicate.save(output_file)
    print("SUCCESS")

if __name__ == "__main__":
    asyncio.run(main())
