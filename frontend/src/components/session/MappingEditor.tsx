import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, Import, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MappingEditorProps {
  currentMapping: Record<string, string>;
  onMappingUpdate: (newMapping: Record<string, string>) => void;
}

const gestureCategories = {
  basic: ["singleBlink", "doubleBlink", "tripleBlink", "longBlink"],
  combined: ["singleBlink_lookLeft", "singleBlink_lookRight", "doubleBlink_lookUp", "doubleBlink_lookDown"]
};

const gestureLabels: Record<string, string> = {
  "singleBlink": "Single Blink",
  "doubleBlink": "Double Blink",
  "tripleBlink": "Triple Blink", 
  "longBlink": "Long Blink",
  "singleBlink_lookLeft": "Blink + Look Left",
  "singleBlink_lookRight": "Blink + Look Right",
  "doubleBlink_lookUp": "Double Blink + Look Up",
  "doubleBlink_lookDown": "Double Blink + Look Down"
};

export const MappingEditor = ({
  currentMapping,
  onMappingUpdate
}: MappingEditorProps) => {
  const [editedMapping, setEditedMapping] = useState(currentMapping);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(currentMapping, null, 2));
  const { toast } = useToast();

  const handlePhraseChange = (gesture: string, phrase: string) => {
    setEditedMapping(prev => ({
      ...prev,
      [gesture]: phrase
    }));
  };

  const handleSave = () => {
    onMappingUpdate(editedMapping);
    toast({
      title: "Mappings Saved",
      description: "Your gesture-to-phrase mappings have been updated"
    });
  };

  const handleReset = () => {
    const defaultMapping = {
      "singleBlink": "Hello",
      "doubleBlink": "Yes",
      "tripleBlink": "No", 
      "longBlink": "Thank you",
      "singleBlink_lookLeft": "I need help",
      "singleBlink_lookRight": "I'm okay",
      "doubleBlink_lookUp": "Water please",
      "doubleBlink_lookDown": "I'm tired"
    };
    setEditedMapping(defaultMapping);
    setJsonInput(JSON.stringify(defaultMapping, null, 2));
  };

  const handleJsonUpdate = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setEditedMapping(parsed);
      toast({
        title: "JSON Imported",
        description: "Mappings updated from JSON input"
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    navigator.clipboard.writeText(JSON.stringify(editedMapping, null, 2));
    toast({
      title: "Exported to Clipboard",
      description: "Mapping configuration copied as JSON"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mapping Editor</span>
          <Badge variant="outline">{Object.keys(editedMapping).length} gestures</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="json">JSON Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Basic Gestures</h3>
                <div className="space-y-3">
                  {gestureCategories.basic.map(gesture => (
                    <div key={gesture} className="space-y-1">
                      <Label className="text-sm font-medium">
                        {gestureLabels[gesture]}
                      </Label>
                      <Input
                        value={editedMapping[gesture] || ""}
                        onChange={(e) => handlePhraseChange(gesture, e.target.value)}
                        placeholder="Enter phrase..."
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Combined Gestures</h3>
                <div className="space-y-3">
                  {gestureCategories.combined.map(gesture => (
                    <div key={gesture} className="space-y-1">
                      <Label className="text-sm font-medium">
                        {gestureLabels[gesture]}
                      </Label>
                      <Input
                        value={editedMapping[gesture] || ""}
                        onChange={(e) => handlePhraseChange(gesture, e.target.value)}
                        placeholder="Enter phrase..."
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">JSON Configuration</Label>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Enter JSON mapping..."
                className="font-mono text-sm min-h-[200px]"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleJsonUpdate}
                className="gap-2"
              >
                <Import className="w-4 h-4" />
                Apply JSON
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button 
            onClick={handleSave} 
            size="sm" 
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleReset} 
            size="sm" 
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExport} 
            size="sm" 
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};