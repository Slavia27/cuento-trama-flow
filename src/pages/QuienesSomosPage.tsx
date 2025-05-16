
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const QuienesSomosPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative bg-white py-16">
          <div className="h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-rasti-blue via-rasti-red to-rasti-yellow"></div>
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-rasti-darkgray mb-6">Quiénes Somos</h1>
              <p className="text-lg text-gray-600 mb-8">
                Somos un equipo de profesionales apasionados por la literatura infantil y la educación, 
                dedicados a crear experiencias de lectura únicas que inspiren a los niños y niñas a soñar, 
                aprender y crecer.
              </p>
            </div>
          </div>
        </section>
        
        {/* Nuestra historia */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square bg-rasti-blue/10 rounded-lg overflow-hidden">
                  <div className="absolute top-6 left-6 w-24 h-24 bg-rasti-red rounded-md rotate-6"></div>
                  <div className="absolute bottom-12 right-12 w-32 h-32 bg-rasti-yellow rounded-md -rotate-12"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-10">
                    <div className="flex gap-1 justify-center mb-2">
                      <div className="w-4 h-4 bg-rasti-red rounded-sm"></div>
                      <div className="w-4 h-4 bg-rasti-yellow rounded-sm"></div>
                      <div className="w-4 h-4 bg-rasti-green rounded-sm"></div>
                      <div className="w-4 h-4 bg-rasti-blue rounded-sm"></div>
                    </div>
                    <p className="font-bold text-center text-gray-800">Fundado en 2023</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6 text-rasti-darkgray">Nuestra historia</h2>
                <p className="text-gray-600 mb-4">
                  Cuentos Personalizados nació en 2023 como un proyecto que busca revolucionar la forma en que los 
                  niños y niñas se relacionan con la lectura. Inspirados en la metodología educativa de Rasti, 
                  donde el juego y la creatividad son fundamentales para el aprendizaje, decidimos crear una 
                  plataforma que permita generar cuentos únicos y personalizados.
                </p>
                <p className="text-gray-600 mb-4">
                  Creemos firmemente que cada niño es único, y por eso sus historias también deben serlo. 
                  Al personalizar cada cuento según los intereses, características y necesidades específicas del pequeño lector, 
                  logramos captar su atención y despertar su amor por la lectura desde temprana edad.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Nuestros valores */}
        <section className="py-16 container">
          <h2 className="text-3xl font-bold mb-10 text-center text-rasti-darkgray">Nuestros valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-rasti-blue">
              <h3 className="text-xl font-bold mb-3 text-rasti-darkgray">Creatividad</h3>
              <p className="text-gray-600">
                Fomentamos la imaginación y la creatividad en cada historia que creamos, inspirando a los niños 
                a pensar de manera diferente y a explorar nuevas posibilidades.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-rasti-red">
              <h3 className="text-xl font-bold mb-3 text-rasti-darkgray">Personalización</h3>
              <p className="text-gray-600">
                Nos adaptamos a las necesidades específicas de cada niño, creando historias que reflejen sus 
                intereses, vivencias y características únicas.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-rasti-green">
              <h3 className="text-xl font-bold mb-3 text-rasti-darkgray">Educación</h3>
              <p className="text-gray-600">
                Integramos elementos educativos en nuestras historias, promoviendo el aprendizaje de manera 
                divertida y significativa para los pequeños lectores.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-rasti-yellow">
              <h3 className="text-xl font-bold mb-3 text-rasti-darkgray">Colaboración</h3>
              <p className="text-gray-600">
                Trabajamos en estrecha colaboración con las familias para asegurarnos de que cada cuento cumpla 
                con sus expectativas y necesidades específicas.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-rasti-blue">
              <h3 className="text-xl font-bold mb-3 text-rasti-darkgray">Inclusión</h3>
              <p className="text-gray-600">
                Creemos que la diversidad enriquece nuestras historias, por lo que nos esforzamos por representar 
                a todos los niños y niñas en nuestros cuentos.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-rasti-red">
              <h3 className="text-xl font-bold mb-3 text-rasti-darkgray">Excelencia</h3>
              <p className="text-gray-600">
                Nos comprometemos con la calidad en cada paso del proceso, desde la creación hasta la entrega 
                del producto final.
              </p>
            </div>
          </div>
        </section>
        
        {/* Nuestro equipo */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4">
            <h2 className="text-3xl font-bold mb-10 text-center text-rasti-darkgray">Nuestro equipo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-rasti-blue/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-rasti-blue rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      CM
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-rasti-darkgray">Carla Muñoz</h3>
                  <p className="text-rasti-blue font-semibold mb-3">Fundadora y Directora Creativa</p>
                  <p className="text-gray-600">
                    Especialista en literatura infantil con más de 10 años de experiencia en el sector editorial.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-rasti-red/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-rasti-red rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      PV
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-rasti-darkgray">Pablo Valenzuela</h3>
                  <p className="text-rasti-red font-semibold mb-3">Director de Tecnología</p>
                  <p className="text-gray-600">
                    Ingeniero informático con especialización en desarrollo web y experiencia en empresas de edtech.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-rasti-green/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-rasti-green rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      LR
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-rasti-darkgray">Laura Rodríguez</h3>
                  <p className="text-rasti-green font-semibold mb-3">Gerente Educativa</p>
                  <p className="text-gray-600">
                    Psicopedagoga con amplia experiencia en educación infantil y desarrollo de materiales didácticos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 container">
          <div className="bg-rasti-blue/10 rounded-xl p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-rasti-darkgray">¿Quieres formar parte de nuestra historia?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Crea un cuento personalizado para ese niño o niña especial en tu vida y ayúdales a descubrir
                el maravilloso mundo de la lectura de una forma única y personalizada.
              </p>
              <Button size="lg" className="bg-rasti-red hover:bg-rasti-red/90 text-white font-semibold px-8 py-6 text-lg">
                <Link to="/formulario">Comenzar mi Cuento</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuienesSomosPage;
