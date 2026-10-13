import 'package:flutter/material.dart';

// Flutter Samsung Notes Model
class SamsungNoteItem {
  final String id;
  String title;
  String content;
  String category;
  bool isPinned;
  List<String> images;
  String updatedAt;

  SamsungNoteItem({
    required this.id,
    required this.title,
    required this.content,
    required this.category,
    required this.isPinned,
    required this.images,
    required this.updatedAt,
  });
}

class SamsungNotesScreen extends StatefulWidget {
  const SamsungNotesScreen({Key? key}) : super(key: key);

  @override
  State<SamsungNotesScreen> createState() => _SamsungNotesScreenState();
}

class _SamsungNotesScreenState extends State<SamsungNotesScreen> {
  static const Color samsungBlue = Color(0xFF2C7BFE);
  static const Color samsungBgBlack = Color(0xFF000000);
  static const Color samsungCardBg = Color(0xFF1C1F2B);

  final List<SamsungNoteItem> _notes = [
    SamsungNoteItem(
      id: 'note-1',
      title: 'Morning Photobiology & Dopamine Baseline',
      content: 'View 10-15 minutes of early sunlight directly without sunglasses within 1 hour of waking. Increases daytime cortisol spike by 50% and anchors evening melatonin onset ~14 hours later.',
      category: 'Circadian Protocol',
      isPinned: true,
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      ],
      updatedAt: 'Today, 8:12 AM',
    ),
    SamsungNoteItem(
      id: 'note-2',
      title: '90-Min Ultradian Deep Work Protocol',
      content: 'Brain operates in 90-minute ultradian focus rhythms. Peak neural flow occurs between minute 10 and 75.',
      category: 'Deep Work',
      isPinned: true,
      images: [
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
      ],
      updatedAt: 'Yesterday, 3:45 PM',
    ),
  ];

  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final filtered = _notes.where((n) {
      return n.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          n.content.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: samsungBgBlack,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Action Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.add, color: Colors.white, size: 26),
                        onPressed: () => _openNoteEditor(null),
                      ),
                      IconButton(
                        icon: const Icon(Icons.more_vert, color: Color(0xFF9EA3B5)),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),
                // Header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 6.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Notes',
                        style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        '${_notes.length} notes',
                        style: const TextStyle(color: Color(0xFF8D92A4), fontSize: 13),
                      ),
                    ],
                  ),
                ),
                // Search Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                  child: TextField(
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: const Color(0xFF171A26),
                      hintText: 'Search notes',
                      hintStyle: const TextStyle(color: Color(0xFF5C6274)),
                      prefixIcon: const Icon(Icons.search, color: Color(0xFF7D8294), size: 18),
                      contentPadding: const EdgeInsets.symmetric(vertical: 10),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF232738)),
                      ),
                    ),
                    onChanged: (val) => setState(() => _searchQuery = val),
                  ),
                ),
                // Notes List
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, idx) {
                      final note = filtered[idx];
                      return InkWell(
                        onTap: () => _openNoteEditor(note),
                        borderRadius: BorderRadius.circular(24),
                        child: Container(
                          decoration: BoxDecoration(
                            color: samsungCardBg,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: const Color(0xFF272B3B)),
                          ),
                          padding: const EdgeInsets.all(18),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(note.category, style: const TextStyle(color: Color(0xFF8E94A7), fontSize: 11)),
                                  if (note.isPinned)
                                    const Text('📌 Pinned', style: TextStyle(color: samsungBlue, fontSize: 11, fontWeight: FontWeight.bold)),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(note.title, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              Text(note.content, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Color(0xFF9DA3B5), fontSize: 12)),
                              const SizedBox(height: 10),
                              Text(note.updatedAt, style: const TextStyle(color: Color(0xFF646A7E), fontSize: 10)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
            // Floating Action Button
            Positioned(
              bottom: 20,
              right: 20,
              child: FloatingActionButton(
                backgroundColor: samsungBlue,
                onPressed: () => _openNoteEditor(null),
                child: const Icon(Icons.edit, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _openNoteEditor(SamsungNoteItem? existingNote) {
    // Note editor modal for creating / editing / attaching images
  }
}

