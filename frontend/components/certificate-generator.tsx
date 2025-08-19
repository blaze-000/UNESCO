"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, Calendar, User, CheckCircle } from "lucide-react"

interface CertificateGeneratorProps {
  studentName: string
  completionDate: string
  onDownload: () => void
  onShare: () => void
}

export function CertificateGenerator({ studentName, completionDate, onDownload, onShare }: CertificateGeneratorProps) {
  return (
    <div className="space-y-8">
      {/* Certificate Preview */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8 md:p-12">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">U</span>
                </div>
                <div className="text-left">
                  <div className="font-heading font-bold text-xl text-foreground">UNESCO</div>
                  <div className="text-sm text-muted-foreground">Youth Hackathon 2025</div>
                </div>
              </div>
              <h2 className="font-heading font-black text-2xl md:text-3xl text-foreground">
                Certificate of Completion
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
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
              </div>

              {/* Course Details */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Completed: {completionDate}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Duration: 6 Weeks
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />5 Modules
                </Badge>
              </div>

              {/* Signature Area */}
              <div className="pt-8 border-t border-border/50">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="w-32 h-px bg-border mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">UNESCO Representative</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-px bg-border mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Course Director</p>
                  </div>
                </div>
              </div>

              {/* Certificate ID */}
              <div className="text-xs text-muted-foreground">
                Certificate ID: UNESCO-YH2025-{Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onDownload} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button onClick={onShare} variant="outline" className="flex items-center gap-2 bg-transparent">
          <Share2 className="w-4 h-4" />
          Share Certificate
        </Button>
      </div>
    </div>
  )
}
