import { Button } from 'antd'

const iconCards = [
  { color: '#8e44ad', icon: 'Q', style: { top: 60, left: 380, rotate: '-20deg' } },
  { color: '#f39c12', icon: '🏃', style: { top: 20, left: 800, rotate: '25deg' } },
  { color: '#2980b9', icon: '🎥', style: { top: 100, left: 600, rotate: '-10deg' } },
  { color: '#f1c40f', icon: 'stripe', style: { top: 160, left: 650, rotate: '10deg' } },
  { color: '#e74c3c', icon: 'PRO', style: { top: 100, left: 900, rotate: '15deg' } },
  { color: '#27ae60', icon: 'score', style: { top: 200, left: 550, rotate: '-15deg' } },
  { color: '#9b59b6', icon: 'woo', style: { top: 220, left: 800, rotate: '-25deg' } },
  { color: '#e67e22', icon: '?', style: { top: 180, left: 400, rotate: '10deg' } }
]

const ExplorerCourse = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      minHeight: 300,
      borderRadius: 20,
      padding: '32px 24px',
      background: 'linear-gradient(90deg, #c6f7e2 0%, #f7d9d9 100%)',
      overflow: 'hidden'
    }}
  >
    <div style={{ flex: 1, zIndex: 2 }}>
      <div style={{ color: '#00897b', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>GET MORE POWER FROM</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>LearnPress Add-Ons</div>
      <div style={{ color: '#555', fontSize: 15, marginBottom: 24, maxWidth: 400 }}>
        The next level of LearnPress - LMS WordPress Plugin. More Powerful, Flexible and Magical Inside.
      </div>
      <Button type='primary' size='large' style={{ background: '#ff6600', borderRadius: 24 }}>
        Explorer Course
      </Button>
    </div>
    <div style={{ flex: 1, position: 'relative', minHeight: 260 }}>
      {iconCards.map((card, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            width: 90,
            height: 90,
            background: card.color,
            color: '#fff',
            fontWeight: 700,
            fontSize: 32,
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            ...card.style,
            transform: `rotate(${card.style.rotate})`,
            userSelect: 'none'
          }}
        >
          {card.icon}
        </div>
      ))}
    </div>
  </div>
)

export default ExplorerCourse
