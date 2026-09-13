$ErrorActionPreference='Stop'
$taskBuild=Split-Path -Parent $MyInvocation.MyCommand.Path
$workspaceDir=Split-Path -Parent (Split-Path -Parent $taskBuild)
$outputDir=Join-Path $workspaceDir 'output/ready-to-submit'
$pptApp=New-Object -ComObject PowerPoint.Application
$deck=$null
try {
 $deck=$pptApp.Presentations.Open((Join-Path $outputDir 'Murshidi-Vcoders-Judges-2026-FINAL-v13.pptx'),-1,0,0)
 if($deck.Slides.Count -ne 12){throw "Expected 12 slides, found $($deck.Slides.Count)"}
 $deck.SaveAs((Join-Path $outputDir 'Murshidi-Vcoders-Judges-2026-FINAL-v13.pdf'),32)
 $renderDir=Join-Path $taskBuild 'final-rendered-v13'
 New-Item -ItemType Directory -Force -Path $renderDir | Out-Null
 for($i=1;$i -le $deck.Slides.Count;$i++){
  $deck.Slides.Item($i).Export((Join-Path $renderDir ('slide-{0:D2}.png' -f $i)),'PNG',1920,1080)
 }
 Write-Output 'Final PPTX opened in PowerPoint; exported PDF and 12 rendered slides.'
} finally {
 if($null -ne $deck){$deck.Close()}
 $pptApp.Quit()
 [Runtime.InteropServices.Marshal]::ReleaseComObject($pptApp) | Out-Null
}
