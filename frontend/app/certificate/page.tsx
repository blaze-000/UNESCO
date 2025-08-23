<<<<<<< HEAD
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Download, Share2, Award, Calendar, User, CheckCircle } from "lucide-react"

export default function CertificatePage() {
  const [studentName, setStudentName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [certificateGenerated, setCertificateGenerated] = useState(false)
=======
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Download,
  Share2,
  Award,
  Calendar,
  User,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/header";

export default function CertificatePage() {
  const [studentName, setStudentName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
<<<<<<< HEAD
  })

  const handleGenerateCertificate = async () => {
    if (!studentName.trim()) return

    setIsGenerating(true)

    // Simulate certificate generation
    setTimeout(() => {
      setIsGenerating(false)
      setCertificateGenerated(true)
    }, 2000)
  }
=======
  });

  const handleGenerateCertificate = async () => {
    if (!studentName.trim()) return;

    setIsGenerating(true);

    // Simulate certificate generation
    setTimeout(() => {
      setIsGenerating(false);
      setCertificateGenerated(true);
    }, 2000);
  };
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    // For now, we'll simulate the download
<<<<<<< HEAD
    const link = document.createElement("a")
    link.href = "#"
    link.download = `UNESCO-Youth-Hackathon-2025-Certificate-${studentName.replace(/\s+/g, "-")}.pdf`
    link.click()
  }
=======
    const link = document.createElement("a");
    link.href = "#";
    link.download = `UNESCO-Youth-Hackathon-2025-Certificate-${studentName.replace(
      /\s+/g,
      "-"
    )}.pdf`;
    link.click();
  };
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "UNESCO Youth Hackathon 2025 Certificate",
          text: `I just completed the Media and Information Literacy course from UNESCO Youth Hackathon 2025!`,
          url: window.location.href,
<<<<<<< HEAD
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Certificate link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">U</span>
                </div>
                <span className="font-heading font-bold text-lg">UNESCO Youth</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/course" className="text-foreground hover:text-primary transition-colors">
                Course
              </Link>
              <Link href="/chats" className="text-foreground hover:text-primary transition-colors">
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </nav>

=======
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Certificate link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-primary" />
            </div>
          </div>
<<<<<<< HEAD
          <h1 className="font-heading font-black text-3xl md:text-4xl text-foreground mb-4">Congratulations!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You've successfully completed the Media and Information Literacy course. Generate your official certificate
            to showcase your achievement.
=======
          <h1 className="font-heading font-black text-3xl md:text-4xl text-foreground mb-4">
            Congratulations!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You've successfully completed the Media and Information Literacy
            course. Generate your official certificate to showcase your
            achievement.
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
          </p>
        </div>

        {/* Course Completion Summary */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Course Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">5</div>
<<<<<<< HEAD
                <div className="text-sm text-muted-foreground">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Course Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">6</div>
                <div className="text-sm text-muted-foreground">Weeks Duration</div>
=======
                <div className="text-sm text-muted-foreground">
                  Modules Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">
                  Course Progress
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">6</div>
                <div className="text-sm text-muted-foreground">
                  Weeks Duration
                </div>
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
              </div>
            </div>
          </CardContent>
        </Card>

        {!certificateGenerated ? (
          /* Certificate Generation Form */
          <Card>
            <CardHeader>
              <CardTitle>Generate Your Certificate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name</Label>
                <Input
                  id="studentName"
                  type="text"
                  placeholder="Enter your full name as you'd like it to appear on the certificate"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
<<<<<<< HEAD
                  This name will appear on your official UNESCO Youth Hackathon 2025 certificate.
=======
                  This name will appear on your official UNESCO Youth Hackathon
                  2025 certificate.
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
                </p>
              </div>

              <Button
                onClick={handleGenerateCertificate}
                disabled={!studentName.trim() || isGenerating}
                className="w-full bg-primary hover:bg-primary/90 text-lg py-3"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Generating Certificate...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Generate Certificate
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Generated Certificate Display */
          <div className="space-y-8">
            {/* Certificate Preview */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8 md:p-12">
                <div className="text-center space-y-6">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
<<<<<<< HEAD
                        <span className="text-primary-foreground font-bold text-lg">U</span>
                      </div>
                      <div className="text-left">
                        <div className="font-heading font-bold text-xl text-foreground">UNESCO</div>
                        <div className="text-sm text-muted-foreground">Youth Hackathon 2025</div>
=======
                        <span className="text-primary-foreground font-bold text-lg">
                          U
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-heading font-bold text-xl text-foreground">
                          UNESCO
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Youth Hackathon 2025
                        </div>
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
                      </div>
                    </div>
                    <h2 className="font-heading font-black text-2xl md:text-3xl text-foreground">
                      Certificate of Completion
                    </h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-6">
<<<<<<< HEAD
                    <p className="text-lg text-muted-foreground">This is to certify that</p>

                    <div className="py-4 px-6 bg-background/50 rounded-lg border border-primary/20">
                      <div className="font-heading font-bold text-2xl md:text-3xl text-primary">{studentName}</div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg text-muted-foreground">has successfully completed the course</p>
                      <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground">
                        Media and Information Literacy for Youth Impact
                      </h3>
                      <p className="text-muted-foreground">Youth Leading the Way: Building MIL Solutions for Impact</p>
=======
                    <p className="text-lg text-muted-foreground">
                      This is to certify that
                    </p>

                    <div className="py-4 px-6 bg-background/50 rounded-lg border border-primary/20">
                      <div className="font-heading font-bold text-2xl md:text-3xl text-primary">
                        {studentName}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg text-muted-foreground">
                        has successfully completed the course
                      </p>
                      <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground">
                        Media and Information Literacy for Youth Impact
                      </h3>
                      <p className="text-muted-foreground">
                        Youth Leading the Way: Building MIL Solutions for Impact
                      </p>
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
                    </div>

                    {/* Course Details */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
<<<<<<< HEAD
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Completed: {completionDate}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Duration: 6 Weeks
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
=======
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        Completed: {completionDate}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <User className="w-3 h-3" />
                        Duration: 6 Weeks
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
                        <CheckCircle className="w-3 h-3" />5 Modules
                      </Badge>
                    </div>

                    {/* Signature Area */}
                    <div className="pt-8 border-t border-border/50">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="text-center">
                          <div className="w-32 h-px bg-border mx-auto mb-2"></div>
<<<<<<< HEAD
                          <p className="text-sm text-muted-foreground">UNESCO Representative</p>
                        </div>
                        <div className="text-center">
                          <div className="w-32 h-px bg-border mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">Course Director</p>
=======
                          <p className="text-sm text-muted-foreground">
                            UNESCO Representative
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-32 h-px bg-border mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">
                            Course Director
                          </p>
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
                        </div>
                      </div>
                    </div>

                    {/* Certificate ID */}
                    <div className="text-xs text-muted-foreground">
<<<<<<< HEAD
                      Certificate ID: UNESCO-YH2025-{Date.now().toString().slice(-6)}
=======
                      Certificate ID: UNESCO-YH2025-
                      {Date.now().toString().slice(-6)}
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
<<<<<<< HEAD
              <Button onClick={handleDownloadPDF} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex items-center gap-2 bg-transparent">
=======
              <Button
                onClick={handleDownloadPDF}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
                <Share2 className="w-4 h-4" />
                Share Certificate
              </Button>
              <Button asChild variant="outline">
                <Link href="/course">View Course Again</Link>
              </Button>
            </div>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
<<<<<<< HEAD
                    Congratulations on completing your Media and Information Literacy journey! Here are some ways to
                    continue making an impact:
=======
                    Congratulations on completing your Media and Information
                    Literacy journey! Here are some ways to continue making an
                    impact:
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Share your knowledge with peers and community members
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Apply MIL skills to identify and combat misinformation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Create content that promotes digital citizenship
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Join the UNESCO Youth Network for continued learning
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
<<<<<<< HEAD
  )
=======
  );
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
}
