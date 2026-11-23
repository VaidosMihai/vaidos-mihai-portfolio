export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  source: "DLT" | "CAN" | "UART" | "PYTEST" | "SYS";
  level: "INFO" | "DEBUG" | "WARN" | "PASS" | "ERROR";
  message: string;
}

export type TelemetryLogTemplate = Omit<TelemetryLogEntry, "id" | "timestamp">;

export const INITIAL_TELEMETRY_LOGS: TelemetryLogEntry[] = [
  {
    id: "init-1",
    timestamp: "00:00:01.104",
    source: "SYS",
    level: "INFO",
    message: "Automotive Diagnostics & Test Framework booted on Linux target.",
  },
  {
    id: "init-2",
    timestamp: "00:00:01.320",
    source: "UART",
    level: "DEBUG",
    message: "Arduino HIL serial link established on /dev/ttyUSB0 @ 115200 8N1.",
  },
  {
    id: "init-3",
    timestamp: "00:00:01.782",
    source: "CAN",
    level: "INFO",
    message: "[ID 0x3A2] Vector CANoe bus online. Tile_Request_State: OK (DLC: 8).",
  },
  {
    id: "init-4",
    timestamp: "00:00:02.115",
    source: "DLT",
    level: "INFO",
    message: "[TELM] Modem firmware rev 4.19.82 - 2G/3G eCall readiness confirmed.",
  },
  {
    id: "init-5",
    timestamp: "00:00:02.894",
    source: "PYTEST",
    level: "PASS",
    message: "test_weekly_sanity.py::test_uart_modem_latch PASSED [100%]",
  },
];

export const STREAM_POOL: TelemetryLogTemplate[] = [
  {
    source: "CAN",
    level: "INFO",
    message: "[ID 0x3A2] CAN_Frame: Parking sensor cluster echo dist=128cm (status=VALID)",
  },
  {
    source: "DLT",
    level: "DEBUG",
    message: "[AUDM] Audio buffer underrun: 0ms. Latency: 3.2ms over ALSA loopback",
  },
  {
    source: "UART",
    level: "INFO",
    message: "HIL_Bench: Antenna relay switch signal pin 12 -> HIGH (Simulating 3G Attenuation)",
  },
  {
    source: "PYTEST",
    level: "PASS",
    message: "test_telematics_reconnect.py::test_2g_fallback_latch PASSED [0.42s]",
  },
  {
    source: "CAN",
    level: "INFO",
    message: "[ID 0x1B4] REM_Tile_Download_Chunk: 4096 bytes transferred. Integrity: OK",
  },
  {
    source: "DLT",
    level: "INFO",
    message: "[ECALL] Trigger SOS latch: Network registered with roaming PLMN 226-01",
  },
  {
    source: "SYS",
    level: "DEBUG",
    message: "Kernel trace: CPU0 load 14.2%, Memory available: 3.4GB, DLT buffer 2%",
  },
];
