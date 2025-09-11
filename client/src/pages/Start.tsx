import { useNavigate } from 'react-router-dom';
import { makeSessionId } from '../utils/id';

function randomAge() { return Math.floor(Math.random() * 141); } // 0..140
function randomSex() { return Math.random() < 0.5 ? 'M' : 'F'; }

export default function Start() {
  const navigate = useNavigate();
  const handleStart = () => {
    const params = new URLSearchParams({
      session_id: makeSessionId(),
      age: String(randomAge()),
      sex: randomSex(),
      return_address: 'https://httpbin.org/post'
    });
    navigate(`/elio?${params.toString()}`);
  };

  return (
    <main className="container">
      <h1>Florencio Client</h1>
      <p>Start the Elio flow</p>
      <div className="card">
        <button onClick={handleStart}>Start Elio</button>
      </div>
    </main>
  );
}
