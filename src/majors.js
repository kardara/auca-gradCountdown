// Degrees and majors of the AUCA 32nd Graduation (Class of 2026), from the
// official graduands list (GRADUANDS_FINAL_2026_NOV-04). `label` is what shows on the frame.

const group = (degree, short, majors) => ({
  degree,
  options: majors.map((m) => ({ major: m, label: m ? `${short} in ${m}` : short })),
})

export const MAJORS = [
  group('Bachelor of Theology', 'Bachelor of Theology', ['']),
  group('Bachelor of Science with Honors in Nursing', 'BSc (Hons)', ['Nursing']),
  group('Bachelor of Business Administration with Honors', 'BBA (Hons)', [
    'Accounting',
    'Finance',
    'Management',
    'Marketing',
  ]),
  group('Bachelor of Education', 'BEd', [
    'Accounting and IT',
    'English and French Language and Literature',
    'Geography and History',
  ]),
  group('Bachelor of Science with Honors (IT)', 'BSc (Hons)', [
    'Information Management',
    'Networks and Communication Systems',
    'Software Engineering',
  ]),
  group('Master of Business Administration', 'MBA', [
    'Accounting',
    'Finance',
    'Human Resource Management',
    'Management',
    'Project Management',
  ]),
  group('Master of Arts in Education', 'MA', [
    'Curriculum, Teaching and Supervision',
    'Educational Administration',
  ]),
  group('Master of Science', 'MSc', ['Big Data Analytics']),
]
