import 'package:flutter/material.dart';

// Model for Alarm Item
class AlarmItem {
  final String id;
  final String time;
  final String period;
  final String label;
  final String category;
  final List<int> days; // 0=Mon, 1=Tue, ..., 6=Sun
  bool isEnabled;
  final String sound;
  final String vibration;

  AlarmItem({
    required this.id,
    required this.time,
    required this.period,
    required this.label,
    required this.category,
    required this.days,
    required this.isEnabled,
    required this.sound,
    required this.vibration,
  });
}

class DailyRhythmAlarmScreen extends StatefulWidget {
  const DailyRhythmAlarmScreen({Key? key}) : super(key: key);

  @override
  State<DailyRhythmAlarmScreen> createState() => _DailyRhythmAlarmScreenState();
}

class _DailyRhythmAlarmScreenState extends State<DailyRhythmAlarmScreen> {
  final List<AlarmItem> _alarms = [
    AlarmItem(
      id: 'alarm-1',
      time: '07:30',
      period: 'AM',
      label: 'Morning Sunlight & Hydration',
      category: 'Morning Routine',
      days: [0, 1, 2, 3, 4, 5, 6],
      isEnabled: true,
      sound: 'Binaural Theta Wave (432Hz)',
      vibration: 'Gradual Escalation',
    ),
    AlarmItem(
      id: 'alarm-2',
      time: '01:30',
      period: 'PM',
      label: 'Afternoon Focus & Supplements',
      category: 'Deep Work',
      days: [0, 1, 2, 3, 4],
      isEnabled: true,
      sound: 'Solar Flare Pulse',
      vibration: 'Double Pulse',
    ),
    AlarmItem(
      id: 'alarm-3',
      time: '10:15',
      period: 'PM',
      label: 'Cortisol Drop & Night Protocol',
      category: 'Recovery',
      days: [0, 1, 2, 3, 4, 5, 6],
      isEnabled: false,
      sound: 'Subtle Dawn Harmonics',
      vibration: 'Gentle Ripple',
    ),
  ];

  static const List<String> _dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  @override
  Widget build(BuildContext context) {
    const Color bgSlate = Color(0xFF090D14);
    const Color emeraldAccent = Color(0xFF10B981);

    return Scaffold(
      backgroundColor: bgSlate,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // HEADER AREA
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Daily Rhythm & Alarms',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      // SUB-BADGE
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: emeraldAccent.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: emeraldAccent.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: emeraldAccent,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Text(
                              'Next alarm in 4h 15m',
                              style: TextStyle(
                                color: emeraldAccent,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                fontFamily: 'monospace',
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  // TOP RIGHT '+' BUTTON
                  InkWell(
                    onTap: _openCreateAlarmModal,
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B).withOpacity(0.8),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.1)),
                      ),
                      child: const Icon(Icons.add, color: Colors.white, size: 24),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // ALARM CARD LIST
              Expanded(
                child: ListView.separated(
                  physics: const BouncingScrollPhysics(),
                  itemCount: _alarms.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 14),
                  itemBuilder: (context, index) {
                    final alarm = _alarms[index];
                    return _buildAlarmCard(alarm);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAlarmCard(AlarmItem alarm) {
    const Color emeraldAccent = Color(0xFF10B981);
    final bool isActive = alarm.isEnabled;

    return Container(
      decoration: BoxDecoration(
        color: isActive
            ? const Color(0xFF0F172A).withOpacity(0.95)
            : const Color(0xFF0F172A).withOpacity(0.4),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isActive
              ? emeraldAccent.withOpacity(0.3)
              : Colors.white.withOpacity(0.05),
        ),
        boxShadow: isActive
            ? [
                BoxShadow(
                  color: emeraldAccent.withOpacity(0.08),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                )
              ]
            : [],
      ),
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Category Tag & Active Dot
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.06),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  alarm.category,
                  style: TextStyle(
                    color: isActive ? Colors.white70 : Colors.white38,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Switch(
                value: alarm.isEnabled,
                activeColor: emeraldAccent,
                activeTrackColor: emeraldAccent.withOpacity(0.4),
                inactiveThumbColor: const Color(0xFF64748B),
                inactiveTrackColor: const Color(0xFF1E293B),
                onChanged: (val) {
                  setState(() {
                    alarm.isEnabled = val;
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Digital Time
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                alarm.time,
                style: TextStyle(
                  color: isActive ? Colors.white : const Color(0xFF64748B),
                  fontSize: 34,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -1,
                ),
              ),
              const SizedBox(width: 4),
              Text(
                alarm.period,
                style: TextStyle(
                  color: isActive ? emeraldAccent : const Color(0xFF475569),
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Label
          Text(
            alarm.label,
            style: TextStyle(
              color: isActive ? const Color(0xFFCBD5E1) : const Color(0xFF64748B),
              fontSize: 13.5,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 14),

          // Day Pills
          Row(
            children: List.generate(_dayLabels.length, (dayIndex) {
              final isHighlighted = alarm.days.contains(dayIndex);
              return Container(
                margin: const EdgeInsets.only(right: 6),
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isHighlighted
                      ? (isActive
                          ? emeraldAccent.withOpacity(0.18)
                          : const Color(0xFF334155))
                      : const Color(0xFF1E293B).withOpacity(0.4),
                  border: Border.all(
                    color: isHighlighted && isActive
                        ? emeraldAccent.withOpacity(0.4)
                        : Colors.transparent,
                  ),
                ),
                alignment: Alignment.center,
                child: Text(
                  _dayLabels[dayIndex],
                  style: TextStyle(
                    color: isHighlighted
                        ? (isActive ? emeraldAccent : Colors.white70)
                        : const Color(0xFF475569),
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  void _openCreateAlarmModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Color(0xFF0F1522),
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Create New Alarm',
                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () => Navigator.pop(context),
                child: const Text('Save Alarm', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      },
    );
  }
}
