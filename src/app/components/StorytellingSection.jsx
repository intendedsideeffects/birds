import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import DonutChart from './DonutChart';

const COLORS = ['#222', '#bbb', '#eee'];

// Data for the extinction growth line chart
const extinctionGrowthData = [
  { year: -5000, extinct: 0 },
  { year: 0, extinct: 100 },
  { year: 1500, extinct: 200 },
  { year: 1800, extinct: 400 },
  { year: 1900, extinct: 700 },
  { year: 2000, extinct: 1200 },
  { year: 2024, extinct: 1350 },
  { year: 2200, extinct: 5400 }, // 50% of ~10800 species
];

// Data for Extinction Rate Development Chart
const extinctionRateData = [
  { year: -5000, rate: 0 },
  { year: -1000, rate: 5 },
  { year: 0, rate: 10 },
  { year: 1000, rate: 30 },
  { year: 1500, rate: 50 },
  { year: 1600, rate: 80 },
  { year: 1700, rate: 120 },
  { year: 1800, rate: 200 },
  { year: 1900, rate: 400 },
  { year: 2000, rate: 800 },
  { year: 2025, rate: 1000 },
];
const backgroundRate = 0.25;

export default function StorytellingSection() {
  // Data for Fact 1
  const extinctionData = [
    { name: 'Human Activity', value: 90 },
    { name: 'Other Causes', value: 10 },
  ];

  // Data for Fact 2
  const habitatData = [
    { name: 'Continents', all: 80, extinct: 12.5 },
    { name: 'Islands', all: 20, extinct: 87.5 },
  ];

  // Data for Fact 3
  const endangeredData = [
    { name: 'Endangered', value: 23.8 },
    { name: 'Declining', value: 26.2 }, // 50-23.8
    { name: 'Stable/Increasing', value: 50 },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto py-32 px-8 flex flex-col gap-48 font-arial-sans">
      {/* Extinction Growth Section */}
      <div className="flex flex-col items-center gap-6 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-black font-arial-sans text-left mx-auto" style={{maxWidth: '900px'}}>
          Around 1350 bird species have gone extinct over the last 7000 years. That's 12.5% of all bird species.
        </h2>
        <div className="w-full max-w-4xl mx-auto" style={{ marginBottom: '30vh' }}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={[
              { year: -5000, extinct: 0 },
              { year: -1000, extinct: 10 },
              { year: 0, extinct: 20 },
              { year: 1000, extinct: 50 },
              { year: 1500, extinct: 100 },
              { year: 1800, extinct: 300 },
              { year: 1900, extinct: 600 },
              { year: 2000, extinct: 1350 },
              { year: 2200, extinct: 6000 },
            ]} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="year" type="number" domain={[-5000, 2200]} tick={{ fill: '#222', fontSize: 16 }} />
              <YAxis domain={[0, 6000]} tick={{ fill: '#222', fontSize: 16 }} label={{ value: 'Extinct species', angle: -90, position: 'insideLeft', fill: '#222', fontSize: 16 }} />
              <Line type="monotone" dataKey="extinct" stroke="#111" strokeWidth={4} dot={{ r: 6, fill: '#fff', stroke: '#111', strokeWidth: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Extinction Rate Facts (as text) */}
      {/* Removed the two lines about current and background extinction rate */}
      {/* Extinction Rate Development Chart */}
      <div className="w-full max-w-4xl mx-auto" style={{ marginBottom: '30vh' }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-black font-arial-sans text-left mx-auto" style={{maxWidth: '900px'}}>
          A normal background extinction rate is 0.25 species per century. We are at 150-200 species per century.
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={extinctionRateData} margin={{ top: 40, right: 40, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="year" type="number" domain={[-5000, 2025]} tick={{ fill: '#222', fontSize: 16 }} />
            <YAxis domain={[0, 1000]} tick={{ fill: '#222', fontSize: 16 }} label={{ value: 'Extinction Rate', angle: -90, position: 'insideLeft', fill: '#222', fontSize: 16 }} />
            <Line type="monotone" dataKey="rate" stroke="#111" strokeWidth={3} dot={false} name="Extinctions" />
            <Line type="linear" dataKey={() => backgroundRate} stroke="#2e7d32" strokeDasharray="6 6" strokeWidth={2} dot={false} name="Natural Background Rate: 0.25 species/century" />
            <Line type="stepAfter" dataKey={() => null} stroke="#d32f2f" strokeWidth={2} dot={false} isAnimationActive={false}
              points={[{ x: 2025, y: 0 }, { x: 2025, y: 1000 }]} />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>-5000</span>
          <span>0</span>
          <span>1000</span>
          <span>1500</span>
          <span>2000</span>
          <span>2025</span>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <span className="block">Dashed green: Natural background rate</span>
          <span className="block">Red: 2025 projection</span>
        </div>
      </div>

      {/* Fact 1: Human Activity vs Other Causes Donut Chart */}
      <div className="w-full max-w-4xl mx-auto" style={{ marginBottom: '30vh' }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-black font-arial-sans text-left mx-auto" style={{maxWidth: '900px'}}>
          Human impact is the overwhelming driver of bird extinctions, far outpacing all natural causes combined. Over 90% of bird species went extinct due to human activities.
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <DonutChart
            data={extinctionData}
            width={1200}
            height={600}
            colors={['#222', '#bbb']}
            labelColor="#111"
            lineColor="#111"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* Fact 2 */}
      <div className="w-full max-w-4xl mx-auto" style={{ marginBottom: '30vh' }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-black font-arial-sans text-left mx-auto" style={{maxWidth: '900px'}}>
          More than 80% of bird species live on continents, but 87.5% of extinct species come from islands.
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-12 text-left" style={{maxWidth: '900px', marginLeft: 0}}>
          Islands, though home to fewer species, have suffered a disproportionate share of extinctions. This pattern highlights the vulnerability of isolated ecosystems to human impact and introduced species.
        </p>
        <div className="w-full max-w-3xl mx-auto">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={habitatData} layout="vertical">
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#222', fontSize: 16 }} />
              <Bar dataKey="all" fill="#bbb" barSize={24} name="% of all species" />
              <Bar dataKey="extinct" fill="#222" barSize={24} name="% of extinct species" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
} 