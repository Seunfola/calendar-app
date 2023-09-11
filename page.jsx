
'use client'
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Transition, Dialog } from '@headlessui/react';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/outline';

const initialEvent = {
  title: '',
  start: '',
  allDay: false,
  id: 0,
};

function Calendar({ allEvents, handleDateClick, addEvent, handleDeleteModal }) {
  useEffect(() => {
    let draggableEl = document.getElementById('draggable-el');
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let id = eventEl.getAttribute("data");
          let start = eventEl.getAttribute("start");
          return { title, id, start };
        }
      });
    }
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineWook, dayGridMonth,timeGridWeek'
      }}
      events={allEvents}
      nowIndicator={true}
      editable={true}
      droppable={true}
      selectable={true}
      selectMirror={true}
      dateClick={handleDateClick}
      drop={(data) => addEvent(data)}
      eventClick={(data) => handleDeleteModal(data)}
    />
  );
}

function DragEvent({ events }) {
  return (
    <div id="draggable-el" className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50">
      <h1 className="font-bold text-lg text-center">Drag Event</h1>
      {events.map(event => (
        <div
          className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
          title={event.title}
          key={event.id}
        >
          {event.title}
        </div>
      ))}
    </div>
  );
}

function DeleteModal({ showDeleteModal, idToDelete, handleDelete, handleCloseModal }) {
  return (
    <Transition.Root show={showDeleteModal} as={Transition}>
      {/* DeleteModal code */}
    </Transition.Root>
  );
}

function AddEventModal({ showModal, newEvent, handleChange, handleSubmit, handleCloseModal }) {
  return (
    <Transition.Root show={showModal} as={Transition}>
      {/* AddEventModal code */}
    </Transition.Root>
  );
}

export default function Home() {

  const [allEvents, setAllEvents] = useState ([
    { title: 'event 1', id: '1' },
    { title: 'event 2', id: '2' },
    { title: 'event 3', id: '3' },
    { title: 'event 4', id: '4' },
    { title: 'event 5', id: '5' },
    { title: 'event 6', id: '6' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState (null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState ({
    title: '',
    start: '',
    allDay: false,
    id: 0
  });

  const handleEventClick = (eventClickInfo) => {
    const updatedEvents = allEvents.map((event) => {
      if (event.id === eventClickInfo.event.id) {
        return { ...event, title: prompt('Edit Event Title:', event.title) || event.title };
      }
      return event;
    });
    setAllEvents(updatedEvents);
  };
  function handleDateClick(arg) {
    setNewEvent({ ...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime() });
    setShowModal(true);
  }

  function addEvent(data) {
    const event = { ...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime() };
    setAllEvents([...allEvents, event]);
  }

  const handleEventDelete = (eventClickInfo) => {
    const eventId = eventClickInfo.event.id;
    setShowDeleteModal(true);
    setIdToDelete(eventId);
  };
  const deleteEvent = () => {
    const updatedEvents = allEvents.filter((event) => event.id !== idToDelete);
    setAllEvents(updatedEvents);
    setShowDeleteModal(false);
  };

  function handleDeleteModal(data) {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  }

  function handleDelete() {
    setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)));
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  function handleCloseModal() {
    setShowModal(false);
    setNewEvent({ ...initialEvent });
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, title: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
    setShowModal(false);
    setNewEvent({ ...initialEvent });
  }

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <Calendar
              allEvents={allEvents}
              handleDateClick={handleDateClick}
              addEvent={addEvent}
              handleDeleteModal={handleDeleteModal}
              eventContent={(arg) => (
                <div onClick={() => handleEventDelete(arg)}>{arg.event.title}</div>
              )}
            />
          </div>
          <DragEvent events={allEvents} />
        </div>
        <DeleteModal
          showDeleteModal={showDeleteModal}
          idToDelete={idToDelete}
          handleDelete={handleDelete}
          handleCloseModal={handleCloseModal}
        />
        <AddEventModal
          showModal={showModal}
          newEvent={newEvent}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
        />
      </main>
    </>
  );
}
