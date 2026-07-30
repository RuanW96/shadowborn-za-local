import { useEffect, useState } from "react";

export default function LoginIntro({
  player,
  logo,
  fallbackImage,
  isMobile = false,
}) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 250),
      setTimeout(() => setStage(2), 850),
      setTimeout(() => setStage(3), 1700),
      setTimeout(() => setStage(4), 2550),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  if (!player) return null;

  const playerImage =
    player.avatar ||
    player.cardPhoto ||
    logo ||
    fallbackImage;

  const clanLogo = logo || fallbackImage;

  const divisionText = player.division
    ? String(player.division).toLowerCase().includes("division")
      ? player.division
      : `Division ${player.division}`
    : null;

  const statusMessages = [
    "Initializing profile...",
    "Syncing clan data...",
    "Loading division...",
    "Entering the arena...",
    "Welcome to Shadowborn ZA",
  ];

  return (
    <div className="sbza-cinematic-intro">
      <style>{loginIntroStyles}</style>

      {/* Background layers */}
      <div className="sbza-intro-vignette" />
      <div className="sbza-intro-grid" />
      <div className="sbza-camera-layer" />

      {/* Strong moving spotlights */}
      <div className="sbza-beam sbza-beam-left" />
      <div className="sbza-beam sbza-beam-right" />

      {/* Visible lightning bolts */}
      <div className="sbza-bolt sbza-bolt-one">
        <span />
        <span />
        <span />
      </div>

      <div className="sbza-bolt sbza-bolt-two">
        <span />
        <span />
        <span />
      </div>

      {/* Background flash */}
      <div className="sbza-screen-flash" />

      {/* Fog */}
      <div className="sbza-fog sbza-fog-one" />
      <div className="sbza-fog sbza-fog-two" />
      <div className="sbza-fog sbza-fog-three" />

      {/* Energy particles */}
      <div className="sbza-particle-field">
        {Array.from({ length: 34 }).map((_, index) => (
          <span
            key={index}
            className="sbza-energy-particle"
            style={{
              left: `${4 + ((index * 23) % 92)}%`,
              bottom: `${-20 - ((index * 9) % 70)}px`,
              animationDelay: `${(index % 11) * 0.16}s`,
              animationDuration: `${2.2 + (index % 7) * 0.24}s`,
              width: `${2 + (index % 4)}px`,
              height: `${6 + (index % 6) * 2}px`,
            }}
          />
        ))}
      </div>

      <main
        className={`sbza-intro-content sbza-stage-${stage}`}
        style={{
          maxWidth: isMobile ? 620 : 900,
        }}
      >
        {/* Large background clan logo */}
        {clanLogo ? (
          <img
            src={clanLogo}
            alt="Shadowborn ZA"
            className="sbza-background-logo"
          />
        ) : null}

        <section
          className="sbza-avatar-zone"
          style={{
            width: isMobile ? 170 : 220,
            height: isMobile ? 170 : 220,
          }}
        >
          {/* Shockwave */}
          <div className="sbza-shockwave sbza-shockwave-one" />
          <div className="sbza-shockwave sbza-shockwave-two" />

          {/* Outer rotating rings */}
          <div className="sbza-orbit sbza-orbit-one">
            <span className="sbza-orbit-light sbza-orbit-light-one" />
          </div>

          <div className="sbza-orbit sbza-orbit-two">
            <span className="sbza-orbit-light sbza-orbit-light-two" />
          </div>

          <div className="sbza-orbit sbza-orbit-three" />

          {/* Energy burst */}
          <div className="sbza-energy-burst">
            {Array.from({ length: 12 }).map((_, index) => (
              <span
                key={index}
                style={{
                  transform: `rotate(${index * 30}deg)`,
                }}
              />
            ))}
          </div>

          {/* Avatar */}
          <div className="sbza-avatar-frame">
            <img
              src={playerImage}
              alt={player.name}
              className="sbza-avatar-image"
            />
          </div>
        </section>

        <div className="sbza-welcome-label">
          Welcome Back
        </div>

        <h1
          className="sbza-player-name"
          style={{
            fontSize: isMobile ? 42 : 78,
          }}
        >
          {player.name}
        </h1>

        <div className="sbza-name-decoration">
          <span />
          <i />
          <span />
        </div>

        <div className="sbza-player-badges">
          {divisionText ? (
            <div className="sbza-division-badge">
              {divisionText}
            </div>
          ) : null}

          {player.isDivisionCaptain ? (
            <div className="sbza-captain-badge">
              <span>♛</span>
              Division Captain
            </div>
          ) : null}

          {player.role &&
          String(player.role).toLowerCase() !== "player" ? (
            <div className="sbza-role-badge">
              {player.role}
            </div>
          ) : null}
        </div>

        <div className="sbza-motto">
          Victory Awaits in the Shadows
        </div>

        <div
          className="sbza-loading-track"
          style={{
            width: isMobile ? 260 : 380,
          }}
        >
          <div className="sbza-loading-fill" />
          <div className="sbza-loading-shine" />
        </div>

        <div className="sbza-loading-status">
          {statusMessages[stage] || statusMessages[0]}
        </div>
      </main>

      <div className="sbza-bottom-cinematic-line" />
      <div className="sbza-top-cinematic-line" />

      <div className="sbza-corner sbza-corner-top-left" />
      <div className="sbza-corner sbza-corner-top-right" />
      <div className="sbza-corner sbza-corner-bottom-left" />
      <div className="sbza-corner sbza-corner-bottom-right" />
    </div>
  );
}

const loginIntroStyles = `
.sbza-cinematic-intro,
.sbza-cinematic-intro * {
  box-sizing: border-box;
}

.sbza-cinematic-intro {
  position: fixed;
  inset: 0;
  z-index: 99999;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: 20px;
  color: white;
  background:
    radial-gradient(circle at 50% 38%, rgba(126,34,206,0.42), transparent 26%),
    radial-gradient(circle at 50% 80%, rgba(76,29,149,0.28), transparent 42%),
    linear-gradient(180deg, #010103 0%, #08020e 46%, #030105 100%);
  animation:
    sbzaWholeIntroAppear 0.25s ease both,
    sbzaCameraZoom 3.3s ease-out both;
  isolation: isolate;
}

.sbza-intro-vignette {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  box-shadow:
    inset 0 0 180px rgba(0,0,0,0.95),
    inset 0 0 60px rgba(0,0,0,0.7);
}

.sbza-intro-grid {
  position: absolute;
  inset: 35% -20% -30%;
  opacity: 0.12;
  transform: perspective(500px) rotateX(62deg);
  transform-origin: top;
  background-image:
    linear-gradient(rgba(168,85,247,0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168,85,247,0.4) 1px, transparent 1px);
  background-size: 55px 55px;
  mask-image: linear-gradient(to bottom, transparent, black 25%, transparent);
  animation: sbzaGridMove 3.3s linear infinite;
}

.sbza-camera-layer {
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.18) 48%, rgba(0,0,0,0.8) 100%);
  animation: sbzaCameraBreath 1.6s ease-in-out infinite alternate;
}

.sbza-beam {
  position: absolute;
  top: -45%;
  width: 44%;
  height: 130%;
  opacity: 0.44;
  filter: blur(22px);
  background: linear-gradient(
    to bottom,
    rgba(216,180,254,0.7),
    rgba(126,34,206,0.24) 40%,
    transparent 78%
  );
  transform-origin: top center;
  mix-blend-mode: screen;
}

.sbza-beam-left {
  left: 2%;
  transform: rotate(21deg);
  animation: sbzaBeamLeft 2.5s ease-in-out infinite alternate;
}

.sbza-beam-right {
  right: 2%;
  transform: rotate(-21deg);
  animation: sbzaBeamRight 2.7s ease-in-out infinite alternate;
}

.sbza-bolt {
  position: absolute;
  top: -6%;
  width: 150px;
  height: 70%;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  filter:
    drop-shadow(0 0 7px #ffffff)
    drop-shadow(0 0 16px #c084fc)
    drop-shadow(0 0 30px #7e22ce);
}

.sbza-bolt span {
  position: absolute;
  width: 6px;
  border-radius: 999px;
  background:
    linear-gradient(
      to bottom,
      rgba(255,255,255,0),
      #ffffff 14%,
      #e9d5ff 42%,
      #a855f7 78%,
      rgba(126,34,206,0)
    );
}

.sbza-bolt span:nth-child(1) {
  top: 0;
  left: 70px;
  height: 38%;
  transform: rotate(18deg);
}

.sbza-bolt span:nth-child(2) {
  top: 31%;
  left: 42px;
  height: 31%;
  transform: rotate(-20deg);
}

.sbza-bolt span:nth-child(3) {
  top: 55%;
  left: 70px;
  height: 38%;
  transform: rotate(17deg);
}

.sbza-bolt-one {
  left: 8%;
  transform: rotate(-7deg);
  animation: sbzaStrongLightning 1.1s linear 0.05s infinite;
}

.sbza-bolt-two {
  right: 8%;
  transform: scaleX(-1) rotate(-5deg);
  animation: sbzaStrongLightning 1.35s linear 0.35s infinite;
}

.sbza-screen-flash {
  position: absolute;
  inset: 0;
  z-index: 19;
  pointer-events: none;
  opacity: 0;
  background:
    radial-gradient(circle, rgba(216,180,254,0.48), transparent 58%),
    rgba(168,85,247,0.09);
  animation: sbzaScreenFlash 1.1s linear 0.05s infinite;
}

.sbza-fog {
  position: absolute;
  z-index: 3;
  bottom: -25%;
  width: 85%;
  height: 62%;
  border-radius: 50%;
  filter: blur(42px);
  opacity: 0.55;
  background:
    radial-gradient(
      ellipse,
      rgba(126,34,206,0.28) 0%,
      rgba(88,28,135,0.15) 40%,
      transparent 72%
    );
}

.sbza-fog-one {
  left: -30%;
  animation: sbzaFogMoveOne 5s ease-in-out infinite alternate;
}

.sbza-fog-two {
  right: -30%;
  animation: sbzaFogMoveTwo 5.5s ease-in-out infinite alternate;
}

.sbza-fog-three {
  left: 10%;
  bottom: -38%;
  width: 80%;
  opacity: 0.38;
  animation: sbzaFogMoveThree 4.4s ease-in-out infinite alternate;
}

.sbza-particle-field {
  position: absolute;
  inset: 0;
  z-index: 4;
  overflow: hidden;
  pointer-events: none;
}

.sbza-energy-particle {
  position: absolute;
  display: block;
  opacity: 0.15;
  border-radius: 999px;
  background: linear-gradient(
    to top,
    transparent,
    #d8b4fe,
    #ffffff
  );
  box-shadow:
    0 0 7px #ffffff,
    0 0 15px #c084fc,
    0 0 25px rgba(168,85,247,0.8);
  animation-name: sbzaSparkRise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.sbza-intro-content {
  position: relative;
  z-index: 10;
  width: 100%;
  text-align: center;
  transform: translateY(10px);
  animation: sbzaContentEntrance 0.7s ease-out both;
}

.sbza-background-logo {
  position: absolute;
  z-index: -1;
  left: 50%;
  top: 41%;
  width: min(680px, 78vw);
  height: min(680px, 78vw);
  object-fit: contain;
  transform: translate(-50%, -50%) scale(0.86);
  opacity: 0;
  filter:
    grayscale(1)
    brightness(2.8)
    contrast(1.5)
    drop-shadow(0 0 42px rgba(168,85,247,0.95));
  mix-blend-mode: screen;
  mask-image: radial-gradient(
    circle at center,
    black 0%,
    black 36%,
    rgba(0,0,0,0.75) 53%,
    transparent 72%
  );
  -webkit-mask-image: radial-gradient(
    circle at center,
    black 0%,
    black 36%,
    rgba(0,0,0,0.75) 53%,
    transparent 72%
  );
  animation: sbzaLargeLogoReveal 3.3s ease-out both;
}

.sbza-avatar-zone {
  position: relative;
  margin: 0 auto 28px;
  display: grid;
  place-items: center;
}

.sbza-avatar-frame {
  position: relative;
  z-index: 8;
  width: 74%;
  height: 74%;
  padding: 6px;
  border-radius: 50%;
  background:
    linear-gradient(
      135deg,
      #ffffff 0%,
      #d8b4fe 22%,
      #7e22ce 53%,
      #241033 75%,
      #c084fc 100%
    );
  box-shadow:
    0 0 22px rgba(255,255,255,0.38),
    0 0 44px rgba(192,132,252,0.9),
    0 0 100px rgba(126,34,206,0.75);
  animation: sbzaAvatarImpact 0.85s cubic-bezier(.15,.88,.22,1.15) both;
}

.sbza-avatar-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 50%;
  background: #07030d;
}

.sbza-orbit {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.sbza-orbit-one {
  inset: -6px;
  border:
    3px solid rgba(216,180,254,0.26);
  border-top-color: #ffffff;
  border-right-color: #a855f7;
  border-bottom-color: transparent;
  box-shadow:
    0 0 24px rgba(192,132,252,0.85),
    inset 0 0 20px rgba(126,34,206,0.35);
  animation: sbzaOrbitClockwise 1.65s linear infinite;
}

.sbza-orbit-two {
  inset: 10px;
  border: 2px dashed rgba(216,180,254,0.68);
  box-shadow: 0 0 16px rgba(168,85,247,0.65);
  animation: sbzaOrbitCounterClockwise 3.1s linear infinite;
}

.sbza-orbit-three {
  inset: -19px;
  border: 1px solid rgba(192,132,252,0.34);
  box-shadow:
    0 0 36px rgba(168,85,247,0.42),
    inset 0 0 24px rgba(76,29,149,0.28);
  animation: sbzaOrbitPulse 1.1s ease-in-out infinite;
}

.sbza-orbit-light {
  position: absolute;
  display: block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: white;
  box-shadow:
    0 0 7px white,
    0 0 14px #d8b4fe,
    0 0 28px #a855f7;
}

.sbza-orbit-light-one {
  top: 4%;
  left: 48%;
}

.sbza-orbit-light-two {
  right: 4%;
  top: 50%;
}

.sbza-shockwave {
  position: absolute;
  z-index: 2;
  inset: 22%;
  border-radius: 50%;
  border: 4px solid rgba(216,180,254,0.75);
  opacity: 0;
  pointer-events: none;
}

.sbza-shockwave-one {
  animation: sbzaShockwave 1.6s ease-out 0.18s infinite;
}

.sbza-shockwave-two {
  animation: sbzaShockwave 1.6s ease-out 0.78s infinite;
}

.sbza-energy-burst {
  position: absolute;
  z-index: 1;
  inset: -25%;
  pointer-events: none;
  animation: sbzaBurstSpin 7s linear infinite;
}

.sbza-energy-burst span {
  position: absolute;
  left: calc(50% - 2px);
  top: 0;
  width: 4px;
  height: 50%;
  transform-origin: center 100%;
  background:
    linear-gradient(
      to top,
      rgba(168,85,247,0.56),
      transparent 80%
    );
  filter: blur(1px);
  opacity: 0.54;
}

.sbza-welcome-label {
  color: #e9d5ff;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 7px;
  text-transform: uppercase;
  text-shadow:
    0 0 10px rgba(216,180,254,0.75),
    0 0 25px rgba(168,85,247,0.8);
  animation: sbzaWelcomeEnter 0.65s ease 0.34s both;
}

.sbza-player-name {
  position: relative;
  margin: 10px 0 0;
  padding: 0 14px;
  line-height: 0.92;
  font-family: Arial Black, Impact, sans-serif;
  font-weight: 1000;
  letter-spacing: 3px;
  text-transform: uppercase;
  overflow-wrap: anywhere;
  color: white;
  text-shadow:
    0 0 7px white,
    0 0 21px rgba(216,180,254,0.95),
    0 0 50px rgba(168,85,247,0.95),
    0 0 90px rgba(88,28,135,0.85);
  animation: sbzaNameImpact 0.66s cubic-bezier(.2,.9,.25,1.1) 0.52s both;
}

.sbza-name-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 17px;
  margin-top: 18px;
  animation: sbzaBadgeEnter 0.5s ease 0.85s both;
}

.sbza-name-decoration span {
  width: min(130px, 22vw);
  height: 2px;
}

.sbza-name-decoration span:first-child {
  background: linear-gradient(
    to right,
    transparent,
    #c084fc
  );
}

.sbza-name-decoration span:last-child {
  background: linear-gradient(
    to left,
    transparent,
    #c084fc
  );
}

.sbza-name-decoration i {
  width: 10px;
  height: 10px;
  display: block;
  transform: rotate(45deg);
  background: white;
  box-shadow:
    0 0 8px white,
    0 0 20px #a855f7;
}

.sbza-player-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 18px;
  animation: sbzaBadgeEnter 0.58s ease 1.05s both;
}

.sbza-division-badge,
.sbza-captain-badge,
.sbza-role-badge {
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.sbza-division-badge {
  color: #f3e8ff;
  border: 1px solid rgba(216,180,254,0.65);
  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,0.35),
      rgba(76,29,149,0.23)
    );
  box-shadow:
    0 0 18px rgba(168,85,247,0.32),
    inset 0 0 12px rgba(216,180,254,0.08);
}

.sbza-captain-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #fde047;
  border: 1px solid rgba(250,204,21,0.72);
  background:
    linear-gradient(
      135deg,
      rgba(250,204,21,0.24),
      rgba(133,77,14,0.18)
    );
  box-shadow:
    0 0 20px rgba(250,204,21,0.24),
    inset 0 0 12px rgba(250,204,21,0.08);
}

.sbza-captain-badge span {
  font-size: 15px;
}

.sbza-role-badge {
  color: #cbd5e1;
  border: 1px solid rgba(203,213,225,0.38);
  background: rgba(71,85,105,0.18);
}

.sbza-motto {
  margin-top: 25px;
  color: #d8c8e8;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 4px;
  text-transform: uppercase;
  animation: sbzaMottoEnter 0.5s ease 1.25s both;
}

.sbza-loading-track {
  position: relative;
  height: 6px;
  margin: 20px auto 0;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid rgba(192,132,252,0.36);
  background: rgba(255,255,255,0.06);
  box-shadow:
    0 0 18px rgba(126,34,206,0.2),
    inset 0 0 8px rgba(0,0,0,0.55);
}

.sbza-loading-fill {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  transform-origin: left center;
  background:
    linear-gradient(
      90deg,
      #3b0764,
      #7e22ce,
      #c084fc,
      #ffffff
    );
  box-shadow:
    0 0 9px #c084fc,
    0 0 18px rgba(168,85,247,0.85);
  animation: sbzaLoadingFill 3.3s linear both;
}

.sbza-loading-shine {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 80px;
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.85),
      transparent
    );
  filter: blur(4px);
  animation: sbzaLoadingShine 1.05s linear infinite;
}

.sbza-loading-status {
  height: 18px;
  margin-top: 11px;
  color: #a78bbd;
  font-size: 9px;
  font-weight: 950;
  letter-spacing: 2.3px;
  text-transform: uppercase;
  animation: sbzaStatusPulse 0.45s ease;
}

.sbza-bottom-cinematic-line,
.sbza-top-cinematic-line {
  position: absolute;
  z-index: 15;
  left: 7%;
  right: 7%;
  height: 1px;
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(192,132,252,0.7),
      transparent
    );
  box-shadow: 0 0 12px rgba(168,85,247,0.38);
}

.sbza-top-cinematic-line {
  top: 5%;
}

.sbza-bottom-cinematic-line {
  bottom: 5%;
}

.sbza-corner {
  position: absolute;
  z-index: 16;
  width: 52px;
  height: 52px;
  opacity: 0.52;
}

.sbza-corner-top-left {
  top: 5%;
  left: 5%;
  border-top: 2px solid #a855f7;
  border-left: 2px solid #a855f7;
}

.sbza-corner-top-right {
  top: 5%;
  right: 5%;
  border-top: 2px solid #a855f7;
  border-right: 2px solid #a855f7;
}

.sbza-corner-bottom-left {
  bottom: 5%;
  left: 5%;
  border-bottom: 2px solid #a855f7;
  border-left: 2px solid #a855f7;
}

.sbza-corner-bottom-right {
  right: 5%;
  bottom: 5%;
  border-right: 2px solid #a855f7;
  border-bottom: 2px solid #a855f7;
}

@keyframes sbzaWholeIntroAppear {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes sbzaCameraZoom {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.045);
  }
}

@keyframes sbzaCameraBreath {
  from {
    transform: scale(0.98);
    opacity: 0.75;
  }

  to {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes sbzaGridMove {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 0 55px;
  }
}

@keyframes sbzaBeamLeft {
  from {
    transform: rotate(17deg) translateX(-7%);
    opacity: 0.28;
  }

  to {
    transform: rotate(28deg) translateX(8%);
    opacity: 0.6;
  }
}

@keyframes sbzaBeamRight {
  from {
    transform: rotate(-17deg) translateX(7%);
    opacity: 0.28;
  }

  to {
    transform: rotate(-28deg) translateX(-8%);
    opacity: 0.6;
  }
}

@keyframes sbzaStrongLightning {
  0%,
  48%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 0.3;
  }

  52% {
    opacity: 1;
  }

  55% {
    opacity: 0.08;
  }

  58% {
    opacity: 0.95;
  }

  61% {
    opacity: 0;
  }

  66% {
    opacity: 0.7;
  }

  70% {
    opacity: 0;
  }
}

@keyframes sbzaScreenFlash {
  0%,
  48%,
  100% {
    opacity: 0;
  }

  52% {
    opacity: 0.85;
  }

  55% {
    opacity: 0;
  }

  58% {
    opacity: 0.5;
  }

  62% {
    opacity: 0;
  }
}

@keyframes sbzaFogMoveOne {
  from {
    transform: translateX(-8%) scale(0.9);
  }

  to {
    transform: translateX(36%) scale(1.18);
  }
}

@keyframes sbzaFogMoveTwo {
  from {
    transform: translateX(8%) scale(0.92);
  }

  to {
    transform: translateX(-36%) scale(1.22);
  }
}

@keyframes sbzaFogMoveThree {
  from {
    transform: translateX(-5%) scale(0.85);
  }

  to {
    transform: translateX(14%) scale(1.2);
  }
}

@keyframes sbzaSparkRise {
  0% {
    opacity: 0;
    transform: translateY(0) rotate(6deg) scale(0.4);
  }

  15% {
    opacity: 1;
    filter: brightness(1.8);
  }

  70% {
    opacity: 0.75;
  }

  100% {
    opacity: 0;
    transform:
      translateY(-115vh)
      translateX(45px)
      rotate(22deg)
      scale(1.35);
  }
}

@keyframes sbzaContentEntrance {
  from {
    opacity: 0;
    transform: translateY(35px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(10px) scale(1);
  }
}

@keyframes sbzaLargeLogoReveal {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.65);
  }

  30% {
    opacity: 0.1;
  }

  100% {
    opacity: 0.045;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes sbzaAvatarImpact {
  0% {
    opacity: 0;
    transform: translateY(-95px) scale(0.44);
    filter: blur(11px);
  }

  65% {
    opacity: 1;
    transform: translateY(7px) scale(1.08);
    filter: blur(0);
  }

  82% {
    transform: translateY(-4px) scale(0.98);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes sbzaOrbitClockwise {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes sbzaOrbitCounterClockwise {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
}

@keyframes sbzaOrbitPulse {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.32;
  }

  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes sbzaShockwave {
  0% {
    transform: scale(0.4);
    opacity: 0.95;
    border-width: 5px;
  }

  100% {
    transform: scale(2.6);
    opacity: 0;
    border-width: 1px;
  }
}

@keyframes sbzaBurstSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes sbzaWelcomeEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
    letter-spacing: 15px;
  }

  to {
    opacity: 1;
    transform: translateY(0);
    letter-spacing: 7px;
  }
}

@keyframes sbzaNameImpact {
  from {
    opacity: 0;
    transform: scaleX(1.38) scaleY(0.55);
    filter: blur(13px);
  }

  70% {
    opacity: 1;
    transform: scaleX(0.96) scaleY(1.05);
    filter: blur(0);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes sbzaBadgeEnter {
  from {
    opacity: 0;
    transform: translateY(17px) scale(0.88);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes sbzaMottoEnter {
  from {
    opacity: 0;
    letter-spacing: 11px;
  }

  to {
    opacity: 1;
    letter-spacing: 4px;
  }
}

@keyframes sbzaLoadingFill {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

@keyframes sbzaLoadingShine {
  from {
    left: -100px;
  }

  to {
    left: calc(100% + 100px);
  }
}

@keyframes sbzaStatusPulse {
  from {
    opacity: 0;
    transform: translateY(7px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 680px) {
  .sbza-cinematic-intro {
    padding: 15px;
  }

  .sbza-background-logo {
    width: 105vw;
    height: 105vw;
    top: 40%;
  }

  .sbza-bolt-one {
    left: -1%;
  }

  .sbza-bolt-two {
    right: -1%;
  }

  .sbza-welcome-label {
    font-size: 10px;
    letter-spacing: 5px;
  }

  .sbza-motto {
    font-size: 9px;
    letter-spacing: 2.3px;
  }

  .sbza-top-cinematic-line,
  .sbza-bottom-cinematic-line {
    left: 4%;
    right: 4%;
  }

  .sbza-corner {
    width: 33px;
    height: 33px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sbza-cinematic-intro *,
  .sbza-cinematic-intro {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
`;