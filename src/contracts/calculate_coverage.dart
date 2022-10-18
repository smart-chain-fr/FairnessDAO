import 'dart:io';

void main(List<String> args) async {
  final lcovFile = args[0];
  final lines = await File(lcovFile).readAsLines();
  final coverage = lines.fold([0, 0], (List<int> data, line) {
    var testedLines = data[0];
    var totalLines = data[1];
    if (line.startsWith('DA')) {
      totalLines++;
      if (!line.endsWith(',0')) {
        testedLines++;
      }
    }
    return [testedLines, totalLines];
  });
  final testedLines = coverage[0];
  final totalLines = coverage[1];
  var totalCoverage = (testedLines / totalLines * 100).toStringAsFixed(2);

  int min_coverage = int.parse(args[1]);
  if(double.parse(totalCoverage) < min_coverage){
        throw Exception('Test coverage failed, min required ${args[1]}%, actual is ${totalCoverage}%');
  }else{
        print('Success !! Total test coverage: ${totalCoverage} %');
  }
}