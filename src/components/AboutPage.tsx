import { useNavigate } from 'react-router';

const AboutPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="about-page">
      <div className="about-content">
        <div className="about-top-nav">
          <button 
            className="back-home-btn" 
            onClick={handleBackToHome}
          >
            На главную
          </button>
          <h1>О приложении "Прогноз погоды"</h1>
        </div>

        <div className="about-section">
          <h2>О проекте</h2>
          <p>Версия: 2.0.0</p>
          <p>Разработано в рамках домашнего задания по курсу JavaScript Basic</p>
          <p>
            <strong>Домашнее задание: </strong>
           Релизовать роутинг в приложении на React и подключить визуальные компоненты (карту и компоненты форм).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;