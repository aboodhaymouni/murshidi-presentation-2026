$ErrorActionPreference = 'Stop'
$taskBuild = Split-Path -Parent $MyInvocation.MyCommand.Path
Add-Type @'
using System;
using System.Runtime.InteropServices;
public class DeckFonts {
 [DllImport("gdi32.dll", CharSet=CharSet.Unicode)] public static extern int AddFontResourceEx(string file,uint flags,IntPtr reserve);
 [DllImport("user32.dll", CharSet=CharSet.Auto)] public static extern IntPtr SendMessageTimeout(IntPtr h,uint msg,IntPtr wp,IntPtr lp,uint flags,uint timeout,out IntPtr result);
}
'@
Get-ChildItem -LiteralPath (Join-Path $taskBuild 'fonts') -Filter '*.ttf' | ForEach-Object { [DeckFonts]::AddFontResourceEx($_.FullName,0,[IntPtr]::Zero) | Out-Null }
$fontResult=[IntPtr]::Zero
[DeckFonts]::SendMessageTimeout([IntPtr]65535,29,[IntPtr]::Zero,[IntPtr]::Zero,2,1000,[ref]$fontResult) | Out-Null
$pptApp=New-Object -ComObject PowerPoint.Application
$deck=$null
try {
 $deck=$pptApp.Presentations.Open((Join-Path $taskBuild 'draft-rtl.pptx'),0,0,0)
 $timings=@(25,45,55,45,40,40,55,45,35,35)
 for($i=1;$i -le $deck.Slides.Count;$i++) {
  $deck.Slides.Item($i).SlideShowTransition.AdvanceOnClick=-1
  $deck.Slides.Item($i).SlideShowTransition.AdvanceOnTime=0
  $deck.Slides.Item($i).SlideShowTransition.AdvanceTime=$timings[$i-1]
 }
 $deck.SaveAs((Join-Path $taskBuild 'draft-embedded.pptx'),24,-1)
 $renderDir=Join-Path $taskBuild 'rendered'
 New-Item -ItemType Directory -Force -Path $renderDir | Out-Null
 for($i=1;$i -le $deck.Slides.Count;$i++) {
  $deck.Slides.Item($i).Export((Join-Path $renderDir ('slide-{0:D2}.png' -f $i)),'PNG',1920,1080)
 }
 Write-Output ('PowerPoint rendered {0} slides; font embedding requested.' -f $deck.Slides.Count)
} finally {
 if($null -ne $deck){$deck.Close()}
 $pptApp.Quit()
 [Runtime.InteropServices.Marshal]::ReleaseComObject($pptApp) | Out-Null
}
