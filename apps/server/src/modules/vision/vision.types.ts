export interface VisionPerson {
  id: string;
  name: string;
  relation: string;
  confidence: number;
  emotion: string;
  activity: string;
  feedbackBangla: string;
  feedbackEnglish: string;
}

export interface VisionScanResult {
  scanId: string;
  targetIdentified: boolean;
  detectedPersons: VisionPerson[];
  sceneDescription: string;
  spokenFeedback: string;
  spokenFeedbackEnglish: string;
  biometricMetrics: {
    faceAlignmentScore: number;
    ambientLighting: string;
    focusLevel: string;
    neuralConfidence: number;
  };
  timestamp: string;
}
