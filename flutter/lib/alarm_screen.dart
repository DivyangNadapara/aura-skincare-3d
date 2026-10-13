import 'package:flutter/material.dart';

// Samsung One UI Alarm Screen for Flutter
class SamsungAlarmItem {
  final String id;
  final String time;
  final String period;
  final String label;
  final String category;
  final List<int> days; // 0=Sun, 1=Mon, ..., 6=Sat
  bool isEnabled;
  final String sound;
  final String vibration;

  SamsungAlarmItem({
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

class SamsungAlarmScreen extends StatefulWidget {
  const SamsungAlarmScreen({Key? key}) : super(key: key);

  @override
  State<SamsungAlarmScreen> createState() => _SamsungAlarmScreenState();
}

class _SamsungAlarmScreenState extends State<SamsungAlarmScreen> {
  final List<SamsungAlarmItem> _alarms = [
    SamsungAlarmItem(
      id: 'alarm-1',
      time: '7:30',
      period: 'AM',
      label: 'Morning Sunlight & Hydration',
      category: 'Morning Routine',
      days: [0, 1, 2, 3, 4, 5, 6], // Every day
      isEnabled: true,
      sound: 'Morning Flower',
      vibration: 'Basic call',
    ),
    SamsungAlarmItem(
      id: 'alarm-2',
      time: '1:30',
      period: 'PM',
      label: 'Afternoon Focus & Supplements',
      category: 'Deep Work',
      days: [1, 2, 3, 4, 5], // Mon - Fri
      isEnabled: true,
      sound: 'Over the Horizon',
      vibration: 'Heartbeat',
    ),
    SamsungAlarmItem(
      id: 'alarm-3',
      time: '10:15',
      period: 'PM',
      label: 'Cortisol Drop & Night Protocol',
      category: 'Recovery',
      days: [0, 1, 2, 3, 4, 5, 6],
      isEnabled: false,
      sound: 'Homecoming',
      vibration: 'Ticktock',
    ),
  ];

  static const List<String> _dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  static const Color samsungBlue = Color(0xFF2C7BFE);
  static const Color samsungBgBlack = Color(0xFF000000);
  static const Color samsungCardBg = Color(0xFF1C1F2B);
  static const Color samsungCardInactive = Color(0xFF14161F);


  @override
  Widget build(BuildContext context) {
    final int activeCount = _alarms.where((a) => a.isEnabled).length;
    final String subtitle = activeCount > 0
        ? 'Next alarm in 4 hours 15 minutes'
        : 'All alarms off';

    return Scaffold(
      backgroundColor: samsungBgBlack,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // SAMSUNG TOP ACTION BAR
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  IconButton(
                    icon: const Icon(Icons.search, color: Color(0xFF9EA3B5)),
                    onPressed: () {},
                  ),
                  IconButton(
                    icon: const Icon(Icons.add, color: Colors.white, size: 26),
                    onPressed: _openSamsungCreateModal,
                  ),
                  IconButton(
                    icon: const Icon(Icons.more_vert, color: Color(0xFF9EA3B5)),
                    onPressed: () {},
                  ),
                ],
              ),
            ),

            // SAMSUNG LARGE ONE UI HEADER
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Alarm',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Color(0xFF8D92A4),
                      fontSize: 14,
                      fontWeight: FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // SAMSUNG ALARM CARD LIST
            Expanded(
              child: ListView.separated(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                itemCount: _alarms.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final alarm = _alarms[index];
                  return _buildSamsungAlarmCard(alarm);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSamsungAlarmCard(SamsungAlarmItem alarm) {
    final bool isActive = alarm.isEnabled;

    return Container(
      decoration: BoxDecoration(
        color: isActive ? samsungCardBg : samsungCardInactive,
        borderRadius: BorderRadius.circular(26),
        border: Border.all(
          color: isActive ? const Color(0xFF272B3B) : const Color(0xFF1A1C25),
        ),
      ),
      padding: const EdgeInsets.all(18),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left: Time, Label, Days
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      alarm.time,
                      style: TextStyle(
                        color: isActive ? Colors.white : const Color(0xFF6C7182),
                        fontSize: 34,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      alarm.period,
                      style: TextStyle(
                        color: isActive ? samsungBlue : const Color(0xFF4B5061),
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  alarm.label,
                  style: TextStyle(
                    color: isActive ? const Color(0xFFCBD0DF) : const Color(0xFF5B6070),
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 12),
                // Days Row
                Row(
                  children: List.generate(_dayLabels.length, (i) {
                    final isSelected = alarm.days.contains(i);
                    return Container(
                      margin: const EdgeInsets.only(right: 6),
                      width: 26,
                      height: 26,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isSelected
                            ? (isActive ? samsungBlue : const Color(0xFF313543))
                            : const Color(0xFF252834),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        _dayLabels[i],
                        style: TextStyle(
                          color: isSelected
                              ? (isActive ? Colors.white : const Color(0xFF8E93A4))
                              : const Color(0xFF6C7182),
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    );
                  }),
                ),
              ],
            ),
          ),

          // Right: Samsung Switch
          Switch(
            value: alarm.isEnabled,
            activeColor: Colors.white,
            activeTrackColor: samsungBlue,
            inactiveThumbColor: const Color(0xFF8A8F9E),
            inactiveTrackColor: const Color(0xFF2E3240),
            onChanged: (val) {
              setState(() {
                alarm.isEnabled = val;
              });
            },
          ),
        ],
      ),
    );
  }

  void _openSamsungCreateModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Color(0xFF12141D),
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFF353A4D),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancel', style: TextStyle(color: Color(0xFF8E94A7))),
                  ),
                  const Text('Add alarm', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Save', style: TextStyle(color: samsungBlue, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: samsungBlue,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () => Navigator.pop(context),
                child: const Text('Save', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      },
    );
  }
}
