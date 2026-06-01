export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ["#161B22", "#0e4429", "#006d32", "#26a641", "#39d353"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white">GrassLog</h1>
        <p className="text-[#8B949E] text-lg max-w-md">
          오늘의 활동을 기록하고, GitHub 잔디 스타일로 시각화하세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md font-medium transition-colors">
            시작하기
          </button>
          <button className="px-6 py-3 border border-[#30363D] hover:border-[#8B949E] text-[#C9D1D9] rounded-md font-medium transition-colors">
            더 알아보기
          </button>
        </div>
      </div>
    </main>
  );
}
