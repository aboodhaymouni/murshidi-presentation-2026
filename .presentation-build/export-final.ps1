$ErrorActionPreference='Stop'
$taskBuild=Split-Path -Parent $MyInvocation.MyCommand.Path
$outputDir=Join-Path (Split-Path -Parent $taskBuild) 'output/judges-presentation'
$pptApp=New-Object -ComObject PowerPoint.Application
$deck=$null
try {
 $deck=$pptApp.Presentations.Open((Join-Path $outputDir 'Murshidi-Vcoders-7min.pptx'),-1,0,0)
 $deck.SaveAs((Join-Path $outputDir 'Murshidi-Vcoders-7min.pdf'),32)
 $renderDir=Join-Path $taskBuild 'final-rendered'
 New-Item -ItemType Directory -Force -Path $renderDir | Out-Null
 for($i=1;$i -le $deck.Slides.Count;$i++){
  $deck.Slides.Item($i).Export((Join-Path $renderDir ('slide-{0:D2}.png' -f $i)),'PNG',1920,1080)
 }
 Write-Output 'Final PPTX opened and exported in PowerPoint, 10 slides.'
} finally {
 if($null -ne $deck){$deck.Close()}
 $pptApp.Quit()
 [Runtime.InteropServices.Marshal]::ReleaseComObject($pptApp) | Out-Null
}
