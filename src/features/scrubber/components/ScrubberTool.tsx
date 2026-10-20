import { useScrubber } from '../hooks/useScrubber';
import { OptionsBar } from './OptionsBar';
import { SecretWarning } from './SecretWarning';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
import { StatsBar } from './StatsBar';
import { KeyList } from './KeyList';

export function ScrubberTool() {
  const {
    rawInput,
    setRawInput,
    keepValues,
    toggleKeepValues,
    spacing,
    setSpacing,
    overrides,
    toggleKey,
    applySmartSelect,
    selectAllKeep,
    selectAllRemove,
    resetOverrides,
    loadSample,
    clearInput,
    parsedLines,
    detectedKeys,
    serializedOutput,
    stats,
  } = useScrubber();

  const hasInput = rawInput.trim().length > 0;

  return (
    <div id="tool" className="w-full">
      {/* Options Bar */}
      <OptionsBar
        keepValues={keepValues}
        onToggleKeepValues={toggleKeepValues}
        spacing={spacing}
        onSpacingChange={setSpacing}
        onSmartSelect={applySmartSelect}
        hasKeys={detectedKeys.length > 0}
      />

      {/* Secret Warning Banner */}
      <SecretWarning show={keepValues || stats.keptValues > 0} keptCount={stats.keptValues} />

      {/* Side-by-side editor panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <InputPanel
          value={rawInput}
          onChange={setRawInput}
          onTrySample={loadSample}
          onClear={clearInput}
        />

        <OutputPanel value={serializedOutput} hasInput={hasInput} />
      </div>

      {/* Stats bar */}
      <StatsBar stats={stats} hasInput={hasInput} />

      {/* Per-key override list */}
      {hasInput && detectedKeys.length > 0 && (
        <KeyList
          parsedLines={parsedLines}
          detectedKeys={detectedKeys}
          globalKeepValues={keepValues}
          overrides={overrides}
          onToggleKey={toggleKey}
          onSelectAllKeep={selectAllKeep}
          onSelectAllRemove={selectAllRemove}
          onResetOverrides={resetOverrides}
        />
      )}
    </div>
  );
}
