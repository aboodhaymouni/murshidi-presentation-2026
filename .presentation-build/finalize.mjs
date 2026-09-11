import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const build=path.dirname(fileURLToPath(import.meta.url));
const workspaceDir=path.dirname(build);
const skill='C:/Users/Abdalrahman/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
process.env.RUNTIME_NODE_MODULES='C:/Users/Abdalrahman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')));
const finalPath=path.join(workspaceDir,'output/judges-presentation/Murshidi-Vcoders-7min.pptx');
const result=await finalizePresentation({
 workspaceDir,candidatePath:path.join(build,'draft-embedded.pptx'),finalPath,
 pythonExecutable:'C:/Users/Abdalrahman/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','6'],
 requiredNativeTableOwnerSlides:[6],requiredNativeChartOwnerSlides:[],
 fontPolicy:{basis:'design',families:['IBM Plex Sans Arabic']},
 verifyArtifactToolImport:true,
 receiptPath:path.join(build,'final-validation.json')
});
console.log(JSON.stringify(result,null,2));
