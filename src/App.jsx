// Silk Road Trail: one screen at a time, held in a single state object that is saved as you go.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Title, { HowToPlay, EndScreen } from './screens/Title.jsx';
import Setup from './screens/Setup.jsx';
import Game from './screens/Game.jsx';
import Town from './screens/Town.jsx';
import Drawer from './components/Drawer.jsx';
import Almanac from './screens/Almanac.jsx';
import { Icon } from './components/art.jsx';
import { makeSfx, setMuted, isMuted, startAmbience, stopAmbience, ambienceFor } from './lib/sound.js';
import { loadRun, saveRun, clearRun, scoreOf, saveBest } from './game/engine.js';

export default function App() {
  const [screen, setScreen] = useState('title');
  const [state, setState] = useState(null);
  const [saved, setSaved] = useState(() => loadRun());
  const [muted, setMutedState] = useState(() => isMuted());
  const [howTo, setHowTo] = useState(false);
  const [almanac, setAlmanac] = useState(false);
  const [panel, setPanel] = useState(null); // 'party' | 'packs'
  const [endInfo, setEndInfo] = useState(null);
  const sfx = useMemo(() => makeSfx(), []);

  // Persist the run whenever it changes, and swap the ambience to match the screen.
  useEffect(() => {
    if (!state || state.finished) return;
    saveRun(state);
    setSaved(state);
    ambienceFor(screen === 'town' ? 'market' : 'wind');
  }, [state, screen]);

  // The engine sets state.screen when the caravan reaches a town; follow it.
  useEffect(() => {
    if (!state) return;
    if (state.screen === 'town' && screen !== 'town') setScreen('town');
  }, [state && state.screen, state && state.legIndex]);

  // A finished run is scored once, the save is cleared, and the end screen takes over.
  useEffect(() => {
    if (!state || !state.finished) return;
    const score = scoreOf(state);
    const best = saveBest(state, score);
    setEndInfo({ score, best });
    clearRun();
    setSaved(null);
    stopAmbience();
    if (state.outcome === 'victory') sfx.win(); else sfx.lose();
    setScreen('end');
  }, [state && state.finished, state && state.outcome]);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  }, [muted]);

  const begin = (fresh) => {
    setState(fresh);
    setScreen('travel');
    setPanel(null);
    startAmbience('wind');
    sfx.select();
  };

  const continueRun = () => {
    if (!saved) return;
    setState(saved);
    setScreen(saved.screen === 'town' ? 'town' : 'travel');
    startAmbience('wind');
    sfx.select();
  };

  const abandon = () => {
    clearRun();
    setSaved(null);
    setState(null);
    sfx.click();
  };

  const newRun = () => {
    setEndInfo(null);
    setState(null);
    setScreen('setup');
  };

  const toTitle = () => {
    setEndInfo(null);
    setState(null);
    setSaved(loadRun());
    setScreen('title');
    stopAmbience();
  };

  const changeScreen = (s) => {
    setScreen(s);
    sfx.click();
  };

  return (
    <div className="min-h-dvh bg-bg text-ink">
      {screen === 'title' && (
        <Title
          onStart={() => changeScreen('setup')}
          onHowTo={() => setHowTo(true)}
          onAlmanac={() => setAlmanac(true)}
          hasSave={!!saved}
          onContinue={continueRun}
          onAbandon={abandon}
          muted={muted}
          onToggleMute={toggleMute}
        />
      )}

      {screen === 'setup' && <Setup onBegin={begin} onBack={() => changeScreen('title')} />}

      {screen === 'travel' && state && (
        <Game
          state={state}
          setState={setState}
          sfx={sfx}
          muted={muted}
          onToggleMute={toggleMute}
          openPanel={panel}
          setOpenPanel={(v) => { setPanel(v); sfx.click(); }}
          showHowTo={() => setHowTo(true)}
          showAlmanac={() => setAlmanac(true)}
          onTitle={toTitle}
          onEnd={() => setScreen('end')}
        />
      )}

      {screen === 'town' && state && (
        <Town
          state={state}
          setState={setState}
          sfx={sfx}
          onDepart={() => setScreen('travel')}
          muted={muted}
          onToggleMute={toggleMute}
          openPanel={panel}
          setOpenPanel={(v) => { setPanel(v); sfx.click(); }}
          showHowTo={() => setHowTo(true)}
          showAlmanac={() => setAlmanac(true)}
          onTitle={toTitle}
        />
      )}

      {screen === 'end' && state && endInfo && (
        <EndScreen state={state} score={endInfo.score} onNewRun={newRun} onTitle={toTitle} />
      )}

      {howTo && <HowToPlay onClose={() => setHowTo(false)} />}

      {almanac && <Almanac state={state} onClose={() => setAlmanac(false)} />}

      {state && (screen === 'travel' || screen === 'town') && (
        <Drawer open={!!panel} onClose={() => setPanel(null)} tab={panel === 'packs' ? 'packs' : 'party'} setTab={(t) => setPanel(t)} state={state} />
      )}

    </div>
  );
}
