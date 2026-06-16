const fs = require('fs');

const makeReplacements = (file) => {
  let content = fs.readFileSync(file, 'utf8');

  const oldEffect1 = `  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "events", id, "photos"),
      orderBy("createdAt", "desc"),
      limit(6)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentPhotos(newPhotos);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, \`events/\${id}/photos\`);
    });

    return () => unsubscribe();
  }, [id]);`;

  const newEffect1 = `  useEffect(() => {
    if (!id) return;

    let q;
    if (event?.guestViewSettings === 'own') {
      q = query(
        collection(db, "events", id, "photos"),
        where("deviceId", "==", deviceId)
      );
    } else {
      q = query(
        collection(db, "events", id, "photos"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (event?.guestViewSettings === 'own') {
        newPhotos.sort((a: any, b: any) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tB - tA;
        });
        newPhotos = newPhotos.slice(0, 6);
      }
      setRecentPhotos(newPhotos);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, \`events/\${id}/photos\`);
    });

    return () => unsubscribe();
  }, [id, event?.guestViewSettings, deviceId]);`;

  const oldEffect2 = `  useEffect(() => {
    if (!id || !hasOpenedModal) return;

    const q = query(
      collection(db, "events", id, "photos"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllPhotos(newPhotos);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, \`events/\${id}/photos_gallery\`);
    });

    return () => unsubscribe();
  }, [id, hasOpenedModal]);`;

  const newEffect2 = `  useEffect(() => {
    if (!id || !hasOpenedModal) return;

    let q;
    if (event?.guestViewSettings === 'own') {
      q = query(
        collection(db, "events", id, "photos"),
        where("deviceId", "==", deviceId)
      );
    } else {
      q = query(
        collection(db, "events", id, "photos"),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (event?.guestViewSettings === 'own') {
        newPhotos.sort((a: any, b: any) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tB - tA;
        });
      }
      setAllPhotos(newPhotos);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, \`events/\${id}/photos_gallery\`);
    });

    return () => unsubscribe();
  }, [id, hasOpenedModal, event?.guestViewSettings, deviceId]);`;

  if (content.includes(oldEffect1)) {
    content = content.replace(oldEffect1, newEffect1);
    console.log(`Successfully replaced effect 1 in ${file}`);
  } else {
    console.log(`Could not find effect 1 in ${file}`);
  }

  if (content.includes(oldEffect2)) {
    content = content.replace(oldEffect2, newEffect2);
    console.log(`Successfully replaced effect 2 in ${file}`);
  } else {
    console.log(`Could not find effect 2 in ${file}`);
  }

  fs.writeFileSync(file, content, 'utf8');
};

['src/pages/GuestView.tsx', 'src/pages/GuestViewHr.tsx', 'src/pages/GuestViewPl.tsx'].forEach(makeReplacements);
