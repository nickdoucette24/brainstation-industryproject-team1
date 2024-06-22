import './LandingPage.scss';
import dellLogoWht from '../../assets/images/logos/dell-spectra-logo-wh.svg';
import monitoring from '../../assets/images/icons+btns/monitoring-icon.svg';
import detection from '../../assets/images/icons+btns/detection-icon.svg';
import scalability from '../../assets/images/icons+btns/scalability-icon.svg';
import integrity from '../../assets/images/icons+btns/brand-icon.svg';
import stability from '../../assets/images/icons+btns/market-stability.svg';
import efficiency from '../../assets/images/icons+btns/efficiency.svg';


function LandingPage() {

    return(
        <div className='landing-page'>
            <main>
                <section className='title'>
                    <div className='title__page-header'>Track MSRP Compliance Effortlessly</div>
                    <div className='title__subheader'>Empower your decision making with Spectra.<br/>Redefining MSRP Tracking.</div>
                </section>
                <section className='card-container'>
                    <div className='card'>
                        <div className='card__features'>
                            <div className='card__features--img'>
                                <img src={monitoring} alt="" />
                                <img src={detection} alt="" />
                                <img src={scalability} alt="" />
                            </div>
                            <div className='card__features--text'>
                                <p>Continuous<br/>Monitoring</p>
                                <p>Accurate<br/>Detection</p>
                                <p>Scalability</p>
                            </div>
                        </div>
                        <div className='card__benefits'>
                            <div className='card__benefits--img'>
                                <img src={integrity} alt="" />
                                <img src={stability} alt="" />
                                <img src={efficiency} alt="" />
                            </div>
                            <div className='card__benefits--text'>
                                <p>Brand<br/>Integrity</p>
                                <p>Market<br/>Stability</p>
                                <p>Efficiency</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='login'>
                    <button className='login__cta'>
                        <img className='login__icon' src="" alt="" />
                        <div className='login__btn-text'>Start Now</div>
                    </button>
                </section>
            </main>
            <div className="dell-molecules">
                <div className="overlap">
                    <div className="overlap-group">
                        <div className="div" />
                        <div className="div-2" />
                        <div className="div-3" />
                        <div className="div-4" />
                        <div className="div-5" />
                        <div className="div-6" />
                    </div>
                    <div className="div-7" />
                </div>
            </div>
            <div className='dell-logo'>
                <img src={dellLogoWht} alt="dell-logo-wht" />
            </div>
        </div>
    )
}

export default LandingPage;
