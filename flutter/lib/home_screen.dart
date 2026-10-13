import 'package:flutter/material.dart';

// Flutter Samsung Home Page with Branch Selection
class SamsungHomeScreen extends StatelessWidget {
  final Function(String) onSelectBranch;

  const SamsungHomeScreen({Key? key, required this.onSelectBranch}) : super(key: key);

  static const Color samsungBlue = Color(0xFF2C7BFE);
  static const Color samsungBgBlack = Color(0xFF000000);
  static const Color samsungCardBg = Color(0xFF1C1F2B);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: samsungBgBlack,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              const Text(
                'Personal System',
                style: TextStyle(color: samsungBlue, fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              const Text(
                'Daily Rhythm',
                style: TextStyle(color: Colors.white, fontSize: 34, fontWeight: FontWeight.bold),
              ),
              const Text(
                'Select a branch to manage your daily routines',
                style: TextStyle(color: Color(0xFF8D92A4), fontSize: 13),
              ),
              const SizedBox(height: 28),

              const Text(
                'SYSTEM BRANCHES',
                style: TextStyle(color: Color(0xFF676D80), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1),
              ),
              const SizedBox(height: 12),

              // Branch 1: Alarms
              InkWell(
                onTap: () => onSelectBranch('alarm'),
                borderRadius: BorderRadius.circular(28),
                child: Container(
                  decoration: BoxDecoration(
                    color: samsungCardBg,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: const Color(0xFF272B3B)),
                  ),
                  padding: const EdgeInsets.all(22),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: samsungBlue.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: const Text('⏰', style: TextStyle(fontSize: 22)),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: samsungBlue.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text('2 Active', style: TextStyle(color: samsungBlue, fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      const Text(
                        'Alarms & Rhythm',
                        style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Circadian wake anchors, deep work surges, and recovery alarms.',
                        style: TextStyle(color: Color(0xFF9DA3B5), fontSize: 12),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: const [
                          Text('Next: 7:30 AM', style: TextStyle(color: samsungBlue, fontSize: 12, fontWeight: FontWeight.bold)),
                          Text('→', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // Branch 2: Notes
              InkWell(
                onTap: () => onSelectBranch('notes'),
                borderRadius: BorderRadius.circular(28),
                child: Container(
                  decoration: BoxDecoration(
                    color: samsungCardBg,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: const Color(0xFF272B3B)),
                  ),
                  padding: const EdgeInsets.all(22),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: samsungBlue.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: const Text('📝', style: TextStyle(fontSize: 22)),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF252838),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text('3 Notes', style: TextStyle(color: Color(0xFF8E94A7), fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      const Text(
                        'Notes & Protocols',
                        style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Create, edit, and organize biohacking logs with photos.',
                        style: TextStyle(color: Color(0xFF9DA3B5), fontSize: 12),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: const [
                          Text('Image attachments enabled', style: TextStyle(color: Color(0xFF8E94A7), fontSize: 12)),
                          Text('→', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

