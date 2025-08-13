import { Layout } from 'antd'

const { Footer: FooterAntd } = Layout

type FooterProps = {
  children: React.ReactNode
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <FooterAntd className='sticky bottom-0 left-0 right-0 z-10 flex h-16 justify-between px-4 py-4'>
      {children}
    </FooterAntd>
  )
}

export default Footer
