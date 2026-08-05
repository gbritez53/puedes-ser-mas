import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'datos', title: 'Datos personales' },
  { id: 'situacion', title: 'Tu situación' },
  { id: 'saboteador', title: 'Tu saboteador' },
  { id: 'habitos', title: 'Hábitos' },
  { id: 'compromiso', title: 'Compromiso' },
  { id: 'mensaje', title: 'Mensaje final' },
];

interface EncuestaData {
  name: string;
  email: string;
  phone: string;
  profession: string;
  sector: string;
  saboteador: string;
  habitos: string[];
  objetivo: string;
  disponibilidad: string;
  mensaje: string;
}

const initialData: EncuestaData = {
  name: '',
  email: '',
  phone: '',
  profession: '',
  sector: '',
  saboteador: '',
  habitos: [],
  objetivo: '',
  disponibilidad: '',
  mensaje: '',
};

const saboteadores = [
  {
    value: 'abandonar',
    label: 'ABANDONAR',
    desc: 'Huir antes del fracaso para evitar la exposición.',
  },
  {
    value: 'procrastinar',
    label: 'PROCRASTINAR',
    desc: 'Reemplazar lo importante por lo urgente como evasión del estrés.',
  },
  {
    value: 'excusas',
    label: 'EXCUSAS',
    desc: 'Externalizar la culpa acusando falta de tiempo o dinero.',
  },
  {
    value: 'perfeccionismo',
    label: 'PERFECCIONISMO',
    desc: 'El miedo al juicio ajeno disfrazado de excelencia.',
  },
];

const habitosOptions = [
  { value: 'abandonar', label: 'Empiezo proyectos con energía pero los dejo a mitad de camino.' },
  { value: 'procrastinar', label: 'Pospongo las tareas importantes hasta el último momento.' },
  { value: 'excusas', label: 'Siento que nunca tengo tiempo ni recursos suficientes.' },
  { value: 'perfeccionismo', label: 'Nada sale lo suficientemente bien como para mostrarlo.' },
  { value: 'abandonar', label: 'Evito situaciones donde podría fracasar o quedar en ridículo.' },
  { value: 'procrastinar', label: 'Me ocupo de lo urgente y dejo lo importante para después.' },
  { value: 'excusas', label: 'Echo la culpa al contexto, la economía o los demás.' },
  { value: 'perfeccionismo', label: 'Rehago el trabajo una y otra vez buscando la perfección.' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

export function EncuestaForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<EncuestaData>(initialData);

  const updateData = (field: keyof EncuestaData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleHabito = (habito: string) => {
    setData((prev) => {
      const habitos = [...prev.habitos];
      if (habitos.includes(habito)) {
        return { ...prev, habitos: habitos.filter((h) => h !== habito) };
      }
      return { ...prev, habitos: [...habitos, habito] };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call — listo para conectar al endpoint de Turso
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('¡Encuesta enviada con éxito!', {
        description: 'Gracias por compartir tu diagnóstico.',
      });
    }, 1200);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          data.name.trim() !== '' &&
          /\S+@\S+\.\S+/.test(data.email) &&
          /^\+?[\d\s()-]{8,}$/.test(data.phone.trim())
        );
      case 1:
        return data.profession.trim() !== '' && data.sector !== '';
      case 2:
        return data.saboteador !== '';
      case 3:
        return data.habitos.length > 0;
      case 4:
        return data.objetivo !== '' && data.disponibilidad !== '';
      default:
        return true;
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-lg mx-auto py-8" role="status" aria-live="polite">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center flex flex-col items-center gap-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-cta/15 border border-cta/40 flex items-center justify-center"
          >
            <ShieldAlert className="h-8 w-8 text-cta" />
          </motion.div>
          <CardTitle className="text-3xl">Gracias, {data.name.split(' ')[0]}</CardTitle>
          <CardDescription className="max-w-sm text-base">
            Tu diagnóstico quedó registrado.{' '}
            <span className="text-white">NADA CAMBIA EN LA ZONA CÓMODA.</span> El primer paso hacia
            tu transformación ya está dado. Te escribiremos por WhatsApp para compartirte tu
            resultado personalizado.
          </CardDescription>
          <Button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(0);
              setData(initialData);
            }}
            variant="outline"
            className="mt-2 rounded-2xl"
          >
            Enviar otra respuesta
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      {/* Progress indicator */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className={cn(
                  'w-4 h-4 rounded-full cursor-pointer transition-colors duration-300',
                  index < currentStep
                    ? 'bg-cta'
                    : index === currentStep
                      ? 'bg-cta ring-4 ring-cta/20'
                      : 'bg-line',
                )}
                onClick={() => {
                  if (index <= currentStep) {
                    setCurrentStep(index);
                  }
                }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.span
                className={cn(
                  'text-xs mt-1.5 hidden sm:block',
                  index === currentStep ? 'text-white font-semibold' : 'text-text-variant',
                )}
              >
                {step.title}
              </motion.span>
            </motion.div>
          ))}
        </div>
        <div className="w-full bg-line h-1.5 rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-cta"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-line/60 shadow-xl rounded-3xl overflow-hidden bg-surface">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                {/* Step 1: Datos personales */}
                {currentStep === 0 && (
                  <>
                    <CardHeader>
                      <CardTitle>Contanos quién sos</CardTitle>
                      <CardDescription>Empecemos con lo básico</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          placeholder="Tu nombre y apellido"
                          value={data.name}
                          onChange={(e) => updateData('name', e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-cta/20 focus:border-cta"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={data.email}
                          onChange={(e) => updateData('email', e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-cta/20 focus:border-cta"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="phone">WhatsApp</Label>
                        <Input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+5491123456789"
                          value={data.phone}
                          onChange={(e) => updateData('phone', e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-cta/20 focus:border-cta"
                        />
                        <p className="text-xs text-text-variant">
                          Te escribiremos por WhatsApp con tu diagnóstico personalizado.
                        </p>
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 2: Situación */}
                {currentStep === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle>Tu situación actual</CardTitle>
                      <CardDescription>Contanos dónde estás parado hoy</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="profession">¿A qué te dedicás?</Label>
                        <Input
                          id="profession"
                          placeholder="Ej: empleado, emprendedor, profesional"
                          value={data.profession}
                          onChange={(e) => updateData('profession', e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-cta/20 focus:border-cta"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="sector">¿En qué rubro trabajás?</Label>
                        <Select
                          value={data.sector}
                          onValueChange={(value) => updateData('sector', value)}
                        >
                          <SelectTrigger
                            id="sector"
                            className="transition-all duration-300 focus:ring-2 focus:ring-cta/20 focus:border-cta"
                          >
                            <SelectValue placeholder="Seleccioná tu rubro" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tecnologia">Tecnología</SelectItem>
                            <SelectItem value="salud">Salud</SelectItem>
                            <SelectItem value="educacion">Educación</SelectItem>
                            <SelectItem value="finanzas">Finanzas</SelectItem>
                            <SelectItem value="comercio">Comercio / Ventas</SelectItem>
                            <SelectItem value="creativo">Creativo / Artes</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 3: Saboteador */}
                {currentStep === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle>Tu saboteador principal</CardTitle>
                      <CardDescription>
                        ¿Cuál de estos frenos sentís que te domina hoy?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <RadioGroup
                        value={data.saboteador}
                        onValueChange={(value) => updateData('saboteador', value)}
                        className="space-y-2"
                      >
                        {saboteadores.map((sab, index) => (
                          <motion.div
                            key={sab.value}
                            className={cn(
                              'flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors',
                              data.saboteador === sab.value
                                ? 'border-cta bg-cta/10'
                                : 'border-line hover:bg-surface-lowest',
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              transition: { delay: 0.1 * index, duration: 0.3 },
                            }}
                          >
                            <RadioGroupItem
                              value={sab.value}
                              id={`saboteador-${index + 1}`}
                              className="mt-1"
                            />
                            <Label
                              htmlFor={`saboteador-${index + 1}`}
                              className="cursor-pointer w-full"
                            >
                              <span className="block font-heading text-lg tracking-wide text-white">
                                {sab.label}
                              </span>
                              <span className="block text-sm text-text-muted">{sab.desc}</span>
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </>
                )}

                {/* Step 4: Hábitos */}
                {currentStep === 3 && (
                  <>
                    <CardHeader>
                      <CardTitle>¿Te identificás con estos hábitos?</CardTitle>
                      <CardDescription>
                        Marcá todos los que resuenen con tu día a día
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-1 gap-2">
                        {habitosOptions.map((habito, index) => (
                          <motion.div
                            key={`${habito.value}-${index}`}
                            className={cn(
                              'flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors',
                              data.habitos.includes(`${habito.value}-${index}`)
                                ? 'border-cta bg-cta/10'
                                : 'border-line hover:bg-surface-lowest',
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ duration: 0.2 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: { delay: 0.05 * index, duration: 0.3 },
                            }}
                            onClick={() => toggleHabito(`${habito.value}-${index}`)}
                          >
                            <Checkbox
                              id={`habito-${habito.value}-${index}`}
                              checked={data.habitos.includes(`${habito.value}-${index}`)}
                              onCheckedChange={() => toggleHabito(`${habito.value}-${index}`)}
                            />
                            <Label
                              htmlFor={`habito-${habito.value}-${index}`}
                              className="cursor-pointer w-full text-text-muted"
                            >
                              {habito.label}
                            </Label>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </>
                )}

                {/* Step 5: Compromiso */}
                {currentStep === 4 && (
                  <>
                    <CardHeader>
                      <CardTitle>Tu compromiso</CardTitle>
                      <CardDescription>La transformación no ocurre sin dirección</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>¿Cuál es tu objetivo principal?</Label>
                        <RadioGroup
                          value={data.objetivo}
                          onValueChange={(value) => updateData('objetivo', value)}
                          className="space-y-2"
                        >
                          {[
                            { value: 'emprender', label: 'Emprender con estructura y dirección' },
                            { value: 'crecer', label: 'Hacer crecer mi negocio actual' },
                            { value: 'liderar', label: 'Desarrollar liderazgo y comunicación' },
                            { value: 'transformar', label: 'Transformar mi mentalidad de base' },
                          ].map((obj, index) => (
                            <motion.div
                              key={obj.value}
                              className={cn(
                                'flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors',
                                data.objetivo === obj.value
                                  ? 'border-cta bg-cta/10'
                                  : 'border-line hover:bg-surface-lowest',
                              )}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                transition: { delay: 0.1 * index, duration: 0.3 },
                              }}
                            >
                              <RadioGroupItem value={obj.value} id={`objetivo-${index + 1}`} />
                              <Label
                                htmlFor={`objetivo-${index + 1}`}
                                className="cursor-pointer w-full"
                              >
                                {obj.label}
                              </Label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>¿Qué disponibilidad real tenés para formarte?</Label>
                        <RadioGroup
                          value={data.disponibilidad}
                          onValueChange={(value) => updateData('disponibilidad', value)}
                          className="space-y-2"
                        >
                          {[
                            {
                              value: 'total',
                              label: 'Compromiso total: priorizo mi transformación',
                            },
                            { value: 'semanal', label: 'Puedo dedicarle horas cada semana' },
                            {
                              value: 'limitada',
                              label: 'Poco tiempo, pero estoy decidido a encontrarlo',
                            },
                          ].map((disp, index) => (
                            <motion.div
                              key={disp.value}
                              className={cn(
                                'flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors',
                                data.disponibilidad === disp.value
                                  ? 'border-cta bg-cta/10'
                                  : 'border-line hover:bg-surface-lowest',
                              )}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                transition: { delay: 0.1 * index, duration: 0.3 },
                              }}
                            >
                              <RadioGroupItem
                                value={disp.value}
                                id={`disponibilidad-${index + 1}`}
                              />
                              <Label
                                htmlFor={`disponibilidad-${index + 1}`}
                                className="cursor-pointer w-full"
                              >
                                {disp.label}
                              </Label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 6: Mensaje final */}
                {currentStep === 5 && (
                  <>
                    <CardHeader>
                      <CardTitle>Un último mensaje</CardTitle>
                      <CardDescription>
                        ¿Qué te gustaría lograr en los próximos 90 días?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="mensaje">Tu mensaje para el futuro vos</Label>
                        <Textarea
                          id="mensaje"
                          placeholder="Escribí tu compromiso y lo que querés transformar..."
                          value={data.mensaje}
                          onChange={(e) => updateData('mensaje', e.target.value)}
                          className="min-h-[120px] transition-all duration-300 focus:ring-2 focus:ring-cta/20 focus:border-cta"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <CardFooter className="flex justify-between pt-6 pb-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 transition-all duration-300 rounded-2xl"
                >
                  <ChevronLeft className="h-4 w-4" /> Atrás
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                  disabled={!isStepValid() || isSubmitting}
                  className="flex items-center gap-1 transition-all duration-300 rounded-2xl bg-cta hover:bg-cta-hover"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? 'Enviar encuesta' : 'Siguiente'}
                      {currentStep === steps.length - 1 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </div>
        </Card>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        className="mt-4 text-center text-sm text-text-variant"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Paso {currentStep + 1} de {steps.length}: {steps[currentStep].title}
      </motion.div>
    </div>
  );
}

export default EncuestaForm;
