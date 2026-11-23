export interface SchematicNode {
  id: string;
  label: string;
  subtitle: string;
  category: "input" | "process" | "hardware" | "protocol" | "output";
  status: "ONLINE" | "ACTIVE" | "PASS";
  details: {
    protocol: string;
    description: string;
    technicalSpecs: string[];
    sampleCodeOrPayload: string;
  };
}

export interface SchematicFlow {
  id: string;
  title: string;
  subtitle: string;
  projectBadge: string;
  tabLabel: string;
  nodes: SchematicNode[];
}

export const SCHEMATICS_DATA: SchematicFlow[] = [
  {
    id: "cariad-rem",
    title: "CARIAD REM (Road Experience Management) Telemetry Pipeline",
    subtitle: "Real-Time Dashcam Vehicle Localization, Vector CANoe Protocol Analysis & Automated Pandas Validation",
    projectBadge: "CARIAD (Volkswagen Group) — REM Platform",
    tabLabel: "CARIAD REM Telemetry",
    nodes: [
      {
        id: "dashcam-sensor-node",
        label: "Dashcam & GPS Rig",
        subtitle: "Real-time Vehicle Capture",
        category: "input",
        status: "ACTIVE",
        details: {
          protocol: "High-Resolution Vision & Telemetry Ingestion",
          description: "Dashboard camera streaming vehicle localization, lane markings, and road feature vectors to vehicle gateway ECU.",
          technicalSpecs: [
            "Source: Forward-facing camera & multi-constellation GNSS",
            "Data Rate: Real-time telemetry frames over vehicle ethernet",
            "Trigger: Dynamic road landmark identification"
          ],
          sampleCodeOrPayload: `// Vehicle Gateway Telemetry Packet Sample
{
  "camera_stream_id": "REM_CAM_FRNT_01",
  "gnss_fix": { "lat": 52.4278, "lon": 10.7891, "acc_m": 0.08 },
  "tile_request_queued": true,
  "timestamp_epoch_ms": 1711928400120
}`
        }
      },
      {
        id: "canoe-ecu-node",
        label: "Vector CANoe Rig",
        subtitle: "Tile Request/Response",
        category: "protocol",
        status: "ONLINE",
        details: {
          protocol: "CAN / CAN-FD & Automotive Ethernet",
          description: "Hardware tool analyzing real-time communication between ECUs and cloud backend, ensuring 100% protocol specification compliance.",
          technicalSpecs: [
            "Hardware: Vector VN1630A / CANoe Runtime",
            "Signals: Tile request handshake, CRC checksums, timeout counters",
            "Standard: CARIAD OEM DBC / ARXML specification"
          ],
          sampleCodeOrPayload: `on message CAN1.REM_Tile_Request {
  if (this.Status == 0x01 && this.PayloadChecksumValid) {
    write("Tile ID 0x%X: Validated against cloud spec", this.TileID);
  }
}`
        }
      },
      {
        id: "pandas-pipeline-node",
        label: "Python / Pandas ETL",
        subtitle: "Massive Dataset Validation",
        category: "process",
        status: "ACTIVE",
        details: {
          protocol: "High-Volume Vectorized Data Processing",
          description: "Python automation scripts reading thousands of parameters across CSV and Excel logs, validating values against test cases and business logic.",
          technicalSpecs: [
            "Libraries: Python 3, Pandas, NumPy",
            "Operations: Range checks, signal drop detection, grouping",
            "Optimization: -30% reduction in manual verification overhead"
          ],
          sampleCodeOrPayload: `import pandas as pd

def validate_rem_telemetry(file_path):
    df = pd.read_csv(file_path)
    # Check signal values within technical boundaries
    anomalies = df[
        (df['camera_latency_ms'] > 120.0) | 
        (df['signal_dropout'] == True)
    ]
    return {
        "status": "PASS" if len(anomalies) == 0 else "FAIL",
        "total_frames": len(df),
        "dropout_count": len(anomalies)
    }`
        }
      },
      {
        id: "four-eyes-node",
        label: "4-Eyes Review Gate",
        subtitle: "Quality & Peer Review",
        category: "process",
        status: "ACTIVE",
        details: {
          protocol: "Strict Automotive Engineering Peer Review",
          description: "Every validation script and automated test logic undergoes mandatory secondary review by senior engineers prior to certifying client deliverables.",
          technicalSpecs: [
            "Gate: Mandatory 2-person sign-off in GitLab / Azure DevOps",
            "Auditing: Traceability to CARIAD requirement tickets",
            "Safety: Prevents false PASS regressions on production firmware"
          ],
          sampleCodeOrPayload: `## 4-EYES SIGN-OFF RECORD
- Author: Vaidos Mihai-Iulian [Software Engineer]
- Senior Reviewer: Lead Systems Engineer (Germany)
- Test Script Hash: sha256:7f9a2b8c...
- Status: APPROVED FOR TELEMETRY CERTIFICATION`
        }
      },
      {
        id: "azure-reports-node",
        label: "Azure DevOps CI",
        subtitle: "Automated Reporting",
        category: "output",
        status: "PASS",
        details: {
          protocol: "Continuous Integration & Stakeholder Reporting",
          description: "Monitors pipeline stability, generates distribution charts and synthesized reports for CARIAD decision-makers, and logs deliverables in Codebeamer.",
          technicalSpecs: [
            "CI: Azure DevOps Pipelines + GitLab CI runners",
            "Reports: Automated PDF/PowerPoint metric distributions",
            "Coordination: Local Romanian team task distribution"
          ],
          sampleCodeOrPayload: `REM_REPORT_SUMMARY:
- Analyzed Frames: 2,450,000
- Protocol Compliance: 100%
- Outlier Rate: 0.00%
- Verdict: PASS FOR CARIAD PRODUCTION RELEASE`
        }
      }
    ]
  },
  {
    id: "graitec-revit",
    title: "Graitec Advance Design & Autodesk Revit Extension Architecture",
    subtitle: "Decoupled WPF (MVVM) Desktop Architecture, 3D Mesh Calculations & Real-Time Re-dimensioning Engine",
    projectBadge: "Graitec — Autodesk Revit Ecosystem",
    tabLabel: "Graitec / Revit (C# .NET)",
    nodes: [
      {
        id: "revit-extension-node",
        label: "Autodesk Revit Host",
        subtitle: "Add-in Ribbon & 3D Canvas",
        category: "input",
        status: "ONLINE",
        details: {
          protocol: "Revit API & Native Ribbon Integration",
          description: "Advance Design Modules suite (Column, Beam, Footing, Slab, Wall, Masonry) running as integrated 3D modeling extensions inside Autodesk Revit.",
          technicalSpecs: [
            "Host: Autodesk Revit 2021-2023 Add-in Ribbon",
            "User Action: Interactive cursor tracking on 3D canvas",
            "Interaction: Two-click point capture for wall perforations"
          ],
          sampleCodeOrPayload: `[Transaction(TransactionMode.Manual)]
public class WallOpeningCommand : IExternalCommand {
    public Result Execute(ExternalCommandData data, ref string msg, ElementSet elements) {
        var viewModel = new MasonryWallOpeningViewModel();
        return viewModel.StartInteractiveSelection(data.Application.ActiveUIDocument);
    }
}`
        }
      },
      {
        id: "mvvm-command-node",
        label: "WPF ICommand & MVVM",
        subtitle: "Decoupled ViewModels",
        category: "process",
        status: "ACTIVE",
        details: {
          protocol: "Model-View-ViewModel (MVVM) Decoupled Pattern",
          description: "Handles user commands without code-behind in Views; manages hierarchical window instantiation and dynamic UserControl switching.",
          technicalSpecs: [
            "Pattern: Pure MVVM with WPF ICommand bindings",
            "Navigation: HierarchicalDataTemplate for nested TreeView pages",
            "View Switching: ContentControl bound to CurrentSelectedPageViewModel"
          ],
          sampleCodeOrPayload: `public ICommand OpenSettingsDialogCommand => new RelayCommand(() => {
    var dialogVm = new SettingsDialogViewModel();
    var dialogView = new SettingsDialogView { DataContext = dialogVm };
    dialogView.ShowDialog();
});`
        }
      },
      {
        id: "mesh-boolean-node",
        label: "3D Geometry Engine",
        subtitle: "Boolean Mesh Subtraction",
        category: "process",
        status: "ACTIVE",
        details: {
          protocol: "Computational 3D Solid Geometry",
          description: "Calculates precise geometric coordinates and performs boolean mesh operations to pierce openings through the 3D wall model.",
          technicalSpecs: [
            "Coordinates: Sub-millimeter floating point 3D vectors",
            "Mesh Operations: Boolean difference on parametric wall solid",
            "Performance: Async calculation to prevent UI thread freezes"
          ],
          sampleCodeOrPayload: `public Mesh3D PerforateWall(Mesh3D wallMesh, Point3D p1, Point3D p2) {
    BoundingBox3D openingBox = GeometryUtils.ComputeOpeningBox(p1, p2);
    return BooleanOperations.Subtract(wallMesh, openingBox);
}`
        }
      },
      {
        id: "notify-prop-node",
        label: "INotifyPropertyChanged",
        subtitle: "Dynamic Re-Dimensioning",
        category: "process",
        status: "PASS",
        details: {
          protocol: "Bidirectional Data Binding & Event Notifications",
          description: "Immediately updates structural dimensions, generating size annotations and 4-edge offset distances without manual drafting.",
          technicalSpecs: [
            "Trigger: Isolated property change events only on affected segments",
            "Annotations: Width, height, top/bottom/left/right wall offsets",
            "Optimization: Eliminates UI-freeze event cascades"
          ],
          sampleCodeOrPayload: `public double OffsetToLeftEdge {
    get => _offsetToLeftEdge;
    set {
        if (SetProperty(ref _offsetToLeftEdge, value)) {
            OnPropertyChanged(nameof(FormattedLeftDimension));
        }
    }
}`
        }
      },
      {
        id: "ef-persistence-node",
        label: "EF Core & SQL Server",
        subtitle: "Local Persistence",
        category: "output",
        status: "PASS",
        details: {
          protocol: "Entity Framework Core / Local Database",
          description: "Stores structural calculation state, materials, reinforcement parameters, and user project configurations with transaction safety.",
          technicalSpecs: [
            "ORM: Entity Framework Core with typed DTO models",
            "Database: SQL Server Management Studio (SSMS) & local DB",
            "Async: Fully non-blocking CRUD repository operations"
          ],
          sampleCodeOrPayload: `public async Task SaveProjectStateAsync(WallProjectDto dto) {
    using var context = new AdvanceDesignDbContext();
    context.WallProjects.Update(dto.ToEntity());
    await context.SaveChangesAsync();
}`
        }
      }
    ]
  },
  {
    id: "mazda-telematics",
    title: "HARMAN / Mazda Telematics & Arduino HIL Pipeline",
    subtitle: "Hardware-In-The-Loop Simulation for 2G/3G eCall & Automated Jenkins CI Sanity Suite",
    projectBadge: "Automotive Telematics (HARMAN / Mazda)",
    tabLabel: "Mazda Telematics HIL",
    nodes: [
      {
        id: "jenkins-node",
        label: "Jenkins CI/CD",
        subtitle: "Weekly Sanity Trigger",
        category: "input",
        status: "ACTIVE",
        details: {
          protocol: "CI Pipeline / Webhook",
          description: "Orchestrates weekly sanity test runs on embedded targets, compiling builds and dispatching automated regression suites.",
          technicalSpecs: [
            "Trigger: Scheduled Cron & Build Webhook",
            "Target: Linux Embedded Automotive OS",
            "Pipeline: Declarative Jenkinsfile with Docker agents"
          ],
          sampleCodeOrPayload: `stage('Automotive Sanity Suite') {
  steps {
    sh 'pytest tests/telematics/ --target=ecu_mazda_v3 --capture=dlt'
    sh 'robot --outputdir results/ sanity_ecall.robot'
  }
}`
        }
      },
      {
        id: "robot-pytest-node",
        label: "Pytest & Robot Fw",
        subtitle: "Test Automation Engine",
        category: "process",
        status: "ACTIVE",
        details: {
          protocol: "Python 3 OOP Test Runner",
          description: "Executes parameterized test scenarios for telematics connectivity, validating state transitions and socket health.",
          technicalSpecs: [
            "Framework: Pytest 7.x + Custom In-House Plugins",
            "Fixtures: Hardware Session Manager & DLT Logger",
            "Coverage: eCall Handshake, Audio Routing, SIM State"
          ],
          sampleCodeOrPayload: `def test_ecall_emergency_trigger(hil_bench):
    # Simulate hardware SOS button press via UART
    hil_bench.send_serial_cmd("ECALL_TRIGGER_FALLBACK_2G")
    assert hil_bench.wait_for_dlt_marker("AUDIO_ROUTE_ESTABLISHED", timeout=5.0)
    assert hil_bench.read_modem_state() == "CALL_IN_PROGRESS"`
        }
      },
      {
        id: "serial-uart-node",
        label: "Serial / UART Bridge",
        subtitle: "Hardware Interface (115200 baud)",
        category: "protocol",
        status: "ONLINE",
        details: {
          protocol: "RS-232 / TTL Serial Communication",
          description: "Bi-directional serial link communicating between the automation host and the micro-controller test jig.",
          technicalSpecs: [
            "Baud Rate: 115200 bps, 8N1",
            "Latency: < 4ms response window",
            "Flow Control: Software XON/XOFF & Hardware RTS/CTS"
          ],
          sampleCodeOrPayload: `>>> TX [0xAA, 0x01, 0x3F, 0x00] -> CMD_PIN_STATE_HIGH
<<< RX [0x55, 0x01, 0x00, 0xFE] <- ACK_OK_STATE_LATCHED`
        }
      },
      {
        id: "arduino-hil-node",
        label: "Arduino HIL Rig",
        subtitle: "Fault Injection & Sim",
        category: "hardware",
        status: "ACTIVE",
        details: {
          protocol: "Hardware Simulation & GPIO Switching",
          description: "Micro-controller simulating physical vehicle harnesses: antenna signal loss, battery voltage drops, and crash sensors.",
          technicalSpecs: [
            "Platform: Arduino Mega / Custom Shield Interface",
            "Relay Matrix: Dual-channel antenna disconnect",
            "Modes: 2G Fallback, 3G roaming, zero-signal attenuation"
          ],
          sampleCodeOrPayload: `void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'F') injectSignalFault(); // Drops 3G antenna relay
    else if (cmd == 'R') restoreSignal();
  }
}`
        }
      },
      {
        id: "dlt-trace-node",
        label: "DLT & ADB Diagnostics",
        subtitle: "Kernel / Middleware Trace",
        category: "output",
        status: "PASS",
        details: {
          protocol: "AUTOSAR DLT (Diagnostic Log and Trace)",
          description: "Captures low-level Linux kernel and automotive middleware logs, parsing diagnostic error frames for root cause analysis.",
          technicalSpecs: [
            "Daemon: dlt-daemon on target Linux",
            "Parser: Python DLT parser streaming live log entries",
            "Filter: APID 'TELM', CTID 'CONN'"
          ],
          sampleCodeOrPayload: `[2026-11-03 00:24:19.812] [TELM] [INFO] Modem state switched to CONNECTED_2G_FALLBACK
[2026-11-03 00:24:19.815] [AUDM] [INFO] Audio route latched to Emergency Mic channel
[2026-11-03 00:24:19.818] [SANITY] [PASS] eCall verification completed with 0 errors.`
        }
      }
    ]
  }
];
